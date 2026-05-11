import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.ts";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Create Supabase client
const supabaseUrl = Deno.env.get("SB_URL");
const supabaseServiceKey = Deno.env.get("SB_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables in server function");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to get user ID from access token
async function getUserId(request: Request): Promise<string | null> {
  const accessToken = request.headers.get("Authorization")?.split(" ")[1];
  if (!accessToken) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    console.log("Auth error:", error);
    return null;
  }
  
  return user.id;
}

// Health check
app.get("/make-server-92eeb12f/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-92eeb12f/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || "" },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log("Signup exception:", error);
    return c.json({ error: "Signup failed" }, 500);
  }
});

// Get all todos for user
app.get("/make-server-92eeb12f/todos", async (c) => {
  try {
    const userId = await getUserId(c.req.raw);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const todosKey = `user:${userId}:todos`;
    const todos = await kv.get(todosKey);

    return c.json({ todos: todos || [] });
  } catch (error) {
    console.log("Error fetching todos:", error);
    return c.json({ error: "Failed to fetch todos" }, 500);
  }
});

// Create or update todos for user
app.post("/make-server-92eeb12f/todos", async (c) => {
  try {
    const userId = await getUserId(c.req.raw);
    if (!userId) {
      console.log("Unauthorized: No user ID found");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { todos } = body;

    if (!Array.isArray(todos)) {
      console.log("Invalid todos format:", todos);
      return c.json({ error: "Todos must be an array" }, 400);
    }

    const todosKey = `user:${userId}:todos`;
    console.log(`Saving ${todos.length} todos for user ${userId}`);
    await kv.set(todosKey, todos);
    console.log("Todos saved successfully");

    return c.json({ success: true, todos });
  } catch (error) {
    console.log("Error saving todos:", error);
    return c.json({ error: "Failed to save todos" }, 500);
  }
});

// Get custom categories for user
app.get("/make-server-92eeb12f/categories", async (c) => {
  try {
    const userId = await getUserId(c.req.raw);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const categoriesKey = `user:${userId}:categories`;
    const categories = await kv.get(categoriesKey);

    return c.json({ categories: categories || [] });
  } catch (error) {
    console.log("Error fetching categories:", error);
    return c.json({ error: "Failed to fetch categories" }, 500);
  }
});

// Save custom categories for user
app.post("/make-server-92eeb12f/categories", async (c) => {
  try {
    const userId = await getUserId(c.req.raw);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { categories } = body;

    if (!Array.isArray(categories)) {
      return c.json({ error: "Categories must be an array" }, 400);
    }

    const categoriesKey = `user:${userId}:categories`;
    await kv.set(categoriesKey, categories);

    return c.json({ success: true, categories });
  } catch (error) {
    console.log("Error saving categories:", error);
    return c.json({ error: "Failed to save categories" }, 500);
  }
});

// Create shareable link
app.post("/make-server-92eeb12f/share", async (c) => {
  try {
    const userId = await getUserId(c.req.raw);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { todos, date } = body;

    if (!Array.isArray(todos)) {
      return c.json({ error: "Todos must be an array" }, 400);
    }

    // Generate unique share ID
    const shareId = crypto.randomUUID();
    const shareKey = `share:${shareId}`;
    
    await kv.set(shareKey, {
      userId,
      todos,
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    return c.json({ shareId });
  } catch (error) {
    console.log("Error creating share link:", error);
    return c.json({ error: "Failed to create share link" }, 500);
  }
});

// Get shared todos
app.get("/make-server-92eeb12f/share/:shareId", async (c) => {
  try {
    const shareId = c.req.param("shareId");
    const shareKey = `share:${shareId}`;
    
    const shareData = await kv.get(shareKey);
    
    if (!shareData) {
      return c.json({ error: "Share not found" }, 404);
    }

    return c.json({ share: shareData });
  } catch (error) {
    console.log("Error fetching shared todos:", error);
    return c.json({ error: "Failed to fetch shared todos" }, 500);
  }
});

Deno.serve(app.fetch);
