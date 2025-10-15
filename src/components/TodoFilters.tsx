import { Filter, ArrowUpDown, ArrowDownAZ, ArrowUpZA, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";

interface TodoFiltersProps {
  sortBy: "none" | "dueDate" | "priority" | "category";
  sortOrder: "asc" | "desc";
  filterCategory: string;
  filterPriority: string;
  customCategories: string[];
  onSortByChange: (value: "none" | "dueDate" | "priority" | "category") => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  onFilterCategoryChange: (value: string) => void;
  onFilterPriorityChange: (value: string) => void;
  onClearFilters: () => void;
}

export function TodoFilters({
  sortBy,
  sortOrder,
  filterCategory,
  filterPriority,
  customCategories,
  onSortByChange,
  onSortOrderChange,
  onFilterCategoryChange,
  onFilterPriorityChange,
  onClearFilters,
}: TodoFiltersProps) {
  const hasActiveFilters = sortBy !== "none" || filterCategory !== "all" || filterPriority !== "all";
  const defaultCategories = ["Work", "Personal", "Shopping", "Health"];

  return (
    <Card className="p-4 bg-gray-900/90 backdrop-blur-sm border-2 border-gray-800 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-violet-400" />
        <h3 className="text-gray-200">Filter & Sort</h3>
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-7 text-xs ml-auto text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Sort By</label>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              disabled={sortBy === "none"}
              onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700 hover:text-white disabled:opacity-50"
            >
              {sortOrder === "asc" ? (
                <ArrowDownAZ className="h-4 w-4" />
              ) : (
                <ArrowUpZA className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400">Category</label>
          <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {defaultCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
              {customCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400">Priority</label>
          <Select value={filterPriority} onValueChange={onFilterPriorityChange}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-800"
        >
          {sortBy !== "none" && (
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-400 border-violet-500/30">
              Sorted by: {sortBy} ({sortOrder})
            </Badge>
          )}
          {filterCategory !== "all" && (
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Category: {filterCategory}
            </Badge>
          )}
          {filterPriority !== "all" && (
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              Priority: {filterPriority}
            </Badge>
          )}
        </motion.div>
      )}
    </Card>
  );
}
