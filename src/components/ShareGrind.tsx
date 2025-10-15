import { useState, useEffect } from "react";
import { Share2, Download, Copy, Check, X, Edit2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { Todo } from "./TodoItem";
import logo from "figma:asset/274ef5507cc1ae6046f9beb8957927723199d5e6.png";

interface ShareGrindProps {
  todos: Todo[];
}

interface ShareTodo {
  id: string;
  title: string;
  isEditing: boolean;
}

export function ShareGrind({ todos }: ShareGrindProps) {
  const [showShareCard, setShowShareCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareTodos, setShareTodos] = useState<ShareTodo[]>([]);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Filter tasks completed today
  const todayCompleted = todos.filter((todo) => {
    if (!todo.completed) return false;
    // For demo purposes, showing all completed tasks
    // In production, you'd check the completion timestamp
    return true;
  });

  // Initialize share todos when modal opens
  useEffect(() => {
    if (showShareCard) {
      setShareTodos(
        todayCompleted.map((todo) => ({
          id: todo.id,
          title: todo.title,
          isEditing: false,
        }))
      );
    }
  }, [showShareCard]);

  if (todayCompleted.length === 0) {
    return null;
  }

  const handleShare = () => {
    setShowShareCard(true);
  };

  const handleRemoveTodo = (id: string) => {
    setShareTodos(shareTodos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (id: string) => {
    setShareTodos(
      shareTodos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: true } : todo
      )
    );
  };

  const handleUpdateTodo = (id: string, newTitle: string) => {
    setShareTodos(
      shareTodos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle, isEditing: false } : todo
      )
    );
  };

  const handleCopyText = () => {
    const text = `💪 PROOF OF GRIND - ${new Date().toLocaleDateString()}\n\n${shareTodos
      .map((todo, i) => `${i + 1}. ✅ ${todo.title}`)
      .join("\n")}\n\n#ProofOfGrind #ProductivityWins`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const { createShareLink } = await import("../utils/api");
      const shareId = await createShareLink(
        shareTodos.map((t) => ({ id: t.id, title: t.title })),
        new Date().toISOString()
      );
      
      const shareUrl = `${window.location.origin}?share=${shareId}`;
      await navigator.clipboard.writeText(shareUrl);
      
      toast.success("Shareable link copied!", {
        description: "Share it on social media",
      });
    } catch (error) {
      console.error("Error creating share link:", error);
      toast.error("Failed to create share link");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white mb-1">
                🔥 {todayCompleted.length} task{todayCompleted.length !== 1 ? "s" : ""} crushed today!
              </h3>
              <p className="text-white/80 text-sm">Share your grind with the world</p>
            </div>
            <Button
              onClick={handleShare}
              className="bg-white text-violet-600 hover:bg-gray-100"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showShareCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareCard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full"
            >
              {/* Share Card Preview */}
              <Card
                id="share-card-content"
                className="p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black border-2 border-violet-500/30 shadow-2xl shadow-violet-500/20"
              >
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <img
                      src={logo}
                      alt="Proof of Grind"
                      className="h-16 w-16 rounded-xl"
                    />
                    <h2
                      className="text-3xl bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"
                      style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                      Proof of Grind
                    </h2>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="text-lg text-gray-200 mb-4">
                    💪 Today's Wins ({shareTodos.length})
                  </h3>
                  {shareTodos.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      No tasks selected for sharing
                    </p>
                  ) : (
                    shareTodos.map((todo, index) => (
                      <div
                        key={todo.id}
                        className="flex items-start gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-800 group"
                      >
                        <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                        {todo.isEditing ? (
                          <Input
                            defaultValue={todo.title}
                            autoFocus
                            onBlur={(e) => handleUpdateTodo(todo.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleUpdateTodo(todo.id, e.currentTarget.value);
                              }
                            }}
                            className="flex-1 text-sm bg-gray-800 border-gray-700 text-gray-200"
                          />
                        ) : (
                          <p className="flex-1 text-gray-200 text-sm">{todo.title}</p>
                        )}
                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTodo(todo.id)}
                            className="h-6 w-6 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTodo(todo.id)}
                            className="h-6 w-6 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="text-center text-gray-500 text-xs">
                  #ProofOfGrind #ProductivityWins
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleCopyText}
                  disabled={shareTodos.length === 0}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={shareTodos.length === 0}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save Image
                </Button>
              </div>

              <Button
                onClick={() => setShowShareCard(false)}
                variant="ghost"
                className="w-full mt-3 text-gray-400 hover:text-gray-200"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
