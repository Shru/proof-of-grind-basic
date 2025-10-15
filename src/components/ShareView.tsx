import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import logo from "figma:asset/274ef5507cc1ae6046f9beb8957927723199d5e6.png";

interface ShareViewProps {
  shareId: string;
  onBack: () => void;
}

interface ShareData {
  userId: string;
  todos: Array<{ id: string; title: string }>;
  date: string;
  createdAt: string;
}

export function ShareView({ shareId, onBack }: ShareViewProps) {
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadShareData();
  }, [shareId]);

  async function loadShareData() {
    try {
      const { fetchSharedTodos } = await import("../utils/api");
      const data = await fetchSharedTodos(shareId);
      setShareData(data);
    } catch (err) {
      console.error("Error loading shared data:", err);
      setError(err instanceof Error ? err.message : "Failed to load shared grind");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <img
            src={logo}
            alt="Loading"
            className="h-20 w-20 rounded-2xl mx-auto mb-4 animate-pulse"
          />
          <p className="text-gray-400">Loading shared grind...</p>
        </div>
      </div>
    );
  }

  if (error || !shareData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="p-8 bg-gray-900/80 border-gray-800 text-center max-w-md">
          <h2 className="text-2xl text-gray-200 mb-4">Grind Not Found</h2>
          <p className="text-gray-400 mb-6">
            {error || "This shared grind doesn't exist or has been removed."}
          </p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const date = new Date(shareData.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative max-w-2xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-6 text-gray-400 hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to App
          </Button>

          <Card className="p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black border-2 border-violet-500/30 shadow-2xl shadow-violet-500/20">
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
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Calendar className="h-4 w-4" />
                <p>{formattedDate}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="text-lg text-gray-200 mb-4">
                💪 Daily Wins ({shareData.todos.length})
              </h3>
              {shareData.todos.map((todo, index) => (
                <div
                  key={todo.id}
                  className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800"
                >
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <p className="text-gray-200 text-sm">{todo.title}</p>
                </div>
              ))}
            </div>

            <div className="text-center text-gray-500 text-xs">
              #ProofOfGrind #ProductivityWins
            </div>
          </Card>

          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">Want to track your own grind?</p>
            <Button
              onClick={onBack}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
