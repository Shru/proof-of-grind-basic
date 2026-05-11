import { useState } from "react";
import { motion } from "motion/react";
import { Trash2, Calendar, Flag, Pencil, Check, X } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  onEdit: (id: string, updates: Partial<Omit<Todo, "id" | "completed">>) => void;
  customCategories: string[];
}

export function TodoItem({ todo, onToggle, onDelete, onEdit, customCategories }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? "");

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

  const defaultCategories = ["Work", "Personal", "Shopping", "Health"];

  const handleEditStart = () => {
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditDueDate(todo.dueDate ?? "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(todo.id, {
      title: editTitle.trim(),
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className={`group relative p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 ${
        todo.completed && !isEditing
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
            disabled={isEditing}
          />
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="border-2 border-violet-600/50 bg-gray-800/80 text-white focus:border-violet-500"
              />
              <div className="grid grid-cols-3 gap-2">
                <Select value={editPriority} onValueChange={(v: "low" | "medium" | "high") => setEditPriority(v)}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                    {customCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white text-sm"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!editTitle.trim()}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
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
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditStart}
                    className="h-8 w-8 text-gray-500 hover:bg-violet-500/20 hover:text-violet-400 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(todo.id)}
                    className="h-8 w-8 text-gray-500 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
