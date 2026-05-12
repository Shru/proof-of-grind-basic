import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

interface TodoInputProps {
  onAdd: (todo: {
    title: string;
    priority: "low" | "medium" | "high";
    category: string;
    dueDate?: string;
  }) => void;
  customCategories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

export function TodoInput({
  onAdd,
  customCategories,
  onAddCategory,
  onDeleteCategory,
}: TodoInputProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        priority,
        category,
        dueDate: dueDate || undefined,
      });
      setTitle("");
      setDueDate("");
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory("");
      setShowCategoryDialog(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "add_new") {
      setShowCategoryDialog(true);
    } else {
      setCategory(value);
    }
  };

  const defaultCategories = ["Work", "Personal", "Shopping", "Health"];

  return (
    <Card className="p-4 bg-gray-900/90 backdrop-blur-sm border-2 border-gray-800 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-2 border-gray-700 bg-gray-800/50 focus:bg-gray-800 transition-colors text-white placeholder:text-gray-500"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {defaultCategories.map((cat) => (
                <SelectItem key={cat} value={cat} className="justify-between gap-2">
                  <span>{cat}</span>
                  <button
                    type="button"
                    onPointerDown={(event) => {
                      event.preventDefault();
                      onDeleteCategory(cat);
                    }}
                    className="ml-auto flex items-center text-red-400 hover:text-red-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </SelectItem>
              ))}
              {customCategories.map((cat) => (
                <SelectItem key={cat} value={cat} className="justify-between gap-2">
                  <span>{cat}</span>
                  <button
                    type="button"
                    onPointerDown={(event) => {
                      event.preventDefault();
                      onDeleteCategory(cat);
                    }}
                    className="ml-auto flex items-center text-red-400 hover:text-red-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </SelectItem>
              ))}
              <SelectItem value="add_new" className="text-violet-400">
                <Plus className="h-3 w-3 inline mr-1" />
                Add New Category
              </SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white"
            placeholder="Due date"
          />

          <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </form>

      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Add New Category</DialogTitle>
          </DialogHeader>
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="bg-gray-800 border-gray-700 text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddCategory();
              }
            }}
          />
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowCategoryDialog(false);
                setNewCategory("");
              }}
              className="text-gray-400 hover:text-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
