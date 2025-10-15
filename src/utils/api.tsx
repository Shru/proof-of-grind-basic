import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
const API_BASE = `${env.SUPABASE_URL}/functions/v1/make-server-92eeb12f`;

// Store access token in memory
let accessToken: string | null = null;

// Auth functions
export async function signup(email: string, password: string, name?: string) {
  const response = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Signup failed");
  }

  // After signup, automatically login
  const loginData = await login(email, password);
  return loginData;
}

export async function login(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Store the access token
    if (data?.session?.access_token) {
      accessToken = data.session.access_token;
      // Also store in localStorage for persistence
      localStorage.setItem("access_token", data.session.access_token);
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function logout() {
  try {
    accessToken = null;
    localStorage.removeItem("access_token");
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
    // Clear token anyway
    accessToken = null;
    localStorage.removeItem("access_token");
  }
}

export async function checkAuthentication() {
  // First check memory
  if (accessToken) {
    return true;
  }
  
  // Then check localStorage
  const storedToken = localStorage.getItem("access_token");
  if (storedToken) {
    accessToken = storedToken;
    return true;
  }
  
  return false;
}

export async function getAccessToken() {
  if (accessToken) {
    return accessToken;
  }
  
  const storedToken = localStorage.getItem("access_token");
  if (storedToken) {
    accessToken = storedToken;
    return storedToken;
  }
  
  return null;
}

// Todo functions
export async function fetchTodos() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return [];
    }

    const response = await fetch(`${API_BASE}/todos`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Error fetching todos:", data.error);
      return [];
    }

    return data.todos || [];
  } catch (error) {
    console.error("Exception fetching todos:", error);
    return [];
  }
}

export async function saveTodos(todos: any[]) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ todos }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to save todos");
  }

  return data.todos;
}

// Categories functions
export async function fetchCategories() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return [];
    }

    const response = await fetch(`${API_BASE}/categories`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Error fetching categories:", data.error);
      return [];
    }

    return data.categories || [];
  } catch (error) {
    console.error("Exception fetching categories:", error);
    return [];
  }
}

export async function saveCategories(categories: string[]) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ categories }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to save categories");
  }

  return data.categories;
}

// Share functions
export async function createShareLink(todos: any[], date?: string) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE}/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ todos, date }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create share link");
  }

  return data.shareId;
}

export async function fetchSharedTodos(shareId: string) {
  const response = await fetch(`${API_BASE}/share/${shareId}`, {
    headers: {
      Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch shared todos");
  }

  return data.share;
}
