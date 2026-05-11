import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogOut } from "lucide-react";
import { TodoItem, Todo } from "./components/TodoItem";
import { TodoInput } from "./components/TodoInput";
import { TodoStats } from "./components/TodoStats";
import { TodoFilters } from "./components/TodoFilters";
import { ShareGrind } from "./components/ShareGrind";
import { ShareView } from "./components/ShareView";
import { Auth } from "./components/Auth";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { checkAuthentication, logout, fetchTodos, saveTodos, fetchCategories, saveCategories } from "./utils/api";
import logo from "./assets/logo.png";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shareId, setShareId] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"none" | "dueDate" | "priority" | "category">("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Check for share link in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get("share");
    if (shareParam) {
      setShareId(shareParam);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Load todos and categories when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Auto-save todos whenever they change (with debounce)
  useEffect(() => {
    if (isAuthenticated && !isLoading && todos.length > 0) {
      const timeoutId = setTimeout(() => {
        saveTodos(todos).catch((error) => {
          console.error("Error saving todos:", error);
        });
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [todos, isAuthenticated, isLoading]);

  // Auto-save categories whenever they change (with debounce)
  useEffect(() => {
    if (isAuthenticated && !isLoading && customCategories.length > 0) {
      const timeoutId = setTimeout(() => {
        saveCategories(customCategories).catch((error) => {
          console.error("Error saving categories:", error);
        });
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [customCategories, isAuthenticated, isLoading]);

  async function checkAuth() {
    try {
      const isAuth = await checkAuthentication();
      setIsAuthenticated(isAuth);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadData() {
    try {
      const [todosData, categoriesData] = await Promise.all([
        fetchTodos(),
        fetchCategories(),
      ]);
      setTodos(todosData || []);
      setCustomCategories(categoriesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      // Don't show error toast for initial load, just set empty arrays
      setTodos([]);
      setCustomCategories([]);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      setIsAuthenticated(false);
      setTodos([]);
      setCustomCategories([]);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout on frontend even if backend fails
      setIsAuthenticated(false);
      setTodos([]);
      setCustomCategories([]);
      toast.success("Logged out");
    }
  }

  const addTodo = (todoData: {
    title: string;
    priority: "low" | "medium" | "high";
    category: string;
    dueDate?: string;
  }) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      ...todoData,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    toast.success("Task added successfully!", {
      description: todoData.title,
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const newCompleted = !todo.completed;
          if (newCompleted) {
            toast.success("Task completed! 🎉", {
              description: todo.title,
            });
          }
          return { ...todo, completed: newCompleted };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.error("Task deleted", {
      description: todo?.title,
    });
  };

  const editTodo = (id: string, updates: Partial<Omit<Todo, "id" | "completed">>) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)));
    toast.success("Task updated");
  };

  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Filter by completion status
    switch (filter) {
      case "active":
        filtered = filtered.filter((todo) => !todo.completed);
        break;
      case "completed":
        filtered = filtered.filter((todo) => todo.completed);
        break;
    }

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter((todo) => todo.category === filterCategory);
    }

    // Filter by priority
    if (filterPriority !== "all") {
      filtered = filtered.filter((todo) => todo.priority === filterPriority);
    }

    // Sort
    if (sortBy !== "none") {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "dueDate":
            // Tasks without due dates go to the end
            if (!a.dueDate && !b.dueDate) comparison = 0;
            else if (!a.dueDate) comparison = 1;
            else if (!b.dueDate) comparison = -1;
            else comparison = a.dueDate.localeCompare(b.dueDate);
            break;

          case "priority":
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
            break;

          case "category":
            comparison = a.category.localeCompare(b.category);
            break;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [todos, filter, filterCategory, filterPriority, sortBy, sortOrder]);

  const stats = useMemo(() => {
    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      active: todos.filter((t) => !t.completed).length,
    };
  }, [todos]);

  const clearFilters = () => {
    setSortBy("none");
    setFilterCategory("all");
    setFilterPriority("all");
    toast.info("Filters cleared");
  };

  const addCustomCategory = (category: string) => {
    if (category && !customCategories.includes(category)) {
      setCustomCategories([...customCategories, category]);
    }
  };

  // Show share view if shareId is present
  if (shareId) {
    return (
      <ShareView
        shareId={shareId}
        onBack={() => {
          setShareId(null);
          window.history.pushState({}, "", window.location.pathname);
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <img
            src={logo}
            alt="Loading"
            className="h-20 w-20 rounded-2xl mx-auto mb-4 animate-pulse"
          />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Auth onAuthenticated={() => setIsAuthenticated(true)} />
        <Toaster position="bottom-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-end justify-center gap-3 mb-3">
            <img 
              src={logo} 
              alt="Proof of Grind Logo" 
              className="h-16 w-16 md:h-20 md:w-20 rounded-2xl shadow-lg shadow-violet-500/20"
            />
            <h1 className="text-3xl md:text-4xl bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent pb-1" style={{ fontFamily: "'Anton', sans-serif" }}>
              Proof of Grind
            </h1>
          </div>
          <p className="text-gray-400">
            Track your grind, flex your mind.
          </p>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="mt-4 text-gray-400 hover:text-gray-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        <div className="space-y-6">
          <TodoStats
            total={stats.total}
            completed={stats.completed}
            active={stats.active}
            filter={filter}
            onFilterChange={setFilter}
          />

          {/* Show TodoInput only in Total Tasks view */}
          {filter === "all" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4 }}
            >
              <TodoInput onAdd={addTodo} customCategories={customCategories} onAddCategory={addCustomCategory} />
            </motion.div>
          )}

          {/* Show TodoFilters only in Active view */}
          {filter === "active" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4 }}
            >
              <TodoFilters
                sortBy={sortBy}
                sortOrder={sortOrder}
                filterCategory={filterCategory}
                filterPriority={filterPriority}
                customCategories={customCategories}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
                onFilterCategoryChange={setFilterCategory}
                onFilterPriorityChange={setFilterPriority}
                onClearFilters={clearFilters}
              />
            </motion.div>
          )}

          {/* Show ShareGrind only in Completed view */}
          {filter === "completed" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4 }}
            >
              <ShareGrind todos={todos} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredTodos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="inline-block p-6 bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800">
                    <p className="text-gray-400">
                      {filter === "completed"
                        ? "No completed tasks yet"
                        : filter === "active"
                        ? "No active tasks"
                        : "No tasks yet. Add one to get started!"}
                    </p>
                  </div>
                </motion.div>
              ) : (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                    customCategories={customCategories}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}
