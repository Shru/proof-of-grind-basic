import { Card } from "./ui/card";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";
import { motion } from "motion/react";

interface TodoStatsProps {
  total: number;
  completed: number;
  active: number;
  filter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
}

export function TodoStats({ total, completed, active, filter, onFilterChange }: TodoStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => onFilterChange("all")}
        className="w-full text-left"
      >
        <Card className={`p-3 md:p-4 bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-0 shadow-lg shadow-violet-500/20 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30 ${
          filter === "all" ? "ring-2 ring-violet-400 ring-offset-2 ring-offset-gray-950" : ""
        }`}>
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-2">
            <div className="text-center md:text-left">
              <p className="text-white/80 text-xs md:text-sm mb-1">Total Tasks</p>
              <p className="text-2xl md:text-3xl">{total}</p>
            </div>
            <ListTodo className="h-6 w-6 md:h-10 md:w-10 opacity-80" />
          </div>
          {filter === "all" && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="h-1 bg-white rounded-full mt-3"
            />
          )}
        </Card>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => onFilterChange("active")}
        className="w-full text-left"
      >
        <Card className={`p-3 md:p-4 bg-gradient-to-br from-amber-600 to-orange-700 text-white border-0 shadow-lg shadow-amber-500/20 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30 ${
          filter === "active" ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-gray-950" : ""
        }`}>
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-2">
            <div className="text-center md:text-left">
              <p className="text-white/80 text-xs md:text-sm mb-1">Active</p>
              <p className="text-2xl md:text-3xl">{active}</p>
            </div>
            <Circle className="h-6 w-6 md:h-10 md:w-10 opacity-80" />
          </div>
          {filter === "active" && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="h-1 bg-white rounded-full mt-3"
            />
          )}
        </Card>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => onFilterChange("completed")}
        className="w-full text-left"
      >
        <Card className={`p-3 md:p-4 bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-0 shadow-lg shadow-emerald-500/20 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 ${
          filter === "completed" ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-gray-950" : ""
        }`}>
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-2">
            <div className="text-center md:text-left">
              <p className="text-white/80 text-xs md:text-sm mb-1">Completed</p>
              <p className="text-2xl md:text-3xl">{completed}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 md:h-10 md:w-10 opacity-80" />
          </div>
          {filter === "completed" && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="h-1 bg-white rounded-full mt-3"
            />
          )}
        </Card>
      </motion.button>
    </div>
  );
}
