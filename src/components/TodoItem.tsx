import { motion } from "motion/react";
import { Check, Trash2, Calendar, Flag } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  category: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const priorityColors = {
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    high: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };

  const categoryColors = {
    Work: "bg-purple-500/20 text-purple-400",
    Personal: "bg-emerald-500/20 text-emerald-400",
    Shopping: "bg-cyan-500/20 text-cyan-400",
    Health: "bg-pink-500/20 text-pink-400",
    Other: "bg-gray-500/20 text-gray-400",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className={`group relative p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 ${
        todo.completed
          ? "bg-gray-900/40 border-gray-800"
          : "bg-gray-900/80 border-gray-800 shadow-sm hover:shadow-md hover:border-gray-700"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            className="h-5 w-5 border-2"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className={`transition-all duration-300 ${
                todo.completed
                  ? "line-through text-gray-600"
                  : "text-gray-100"
              }`}
            >
              {todo.title}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(todo.id)}
              className="h-8 w-8 shrink-0 text-gray-500 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={`${priorityColors[todo.priority]} border`}
            >
              <Flag className="h-3 w-3 mr-1" />
              {todo.priority}
            </Badge>

            <Badge
              variant="outline"
              className={categoryColors[todo.category as keyof typeof categoryColors] || categoryColors.Other}
            >
              {todo.category}
            </Badge>

            {todo.dueDate && (
              <Badge variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700">
                <Calendar className="h-3 w-3 mr-1" />
                Due: {todo.dueDate}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
