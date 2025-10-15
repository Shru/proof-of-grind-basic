import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { toast } from "sonner@2.0.3";
import { login, signup } from "../utils/api";
import logo from "figma:asset/274ef5507cc1ae6046f9beb8957927723199d5e6.png";

interface AuthProps {
  onAuthenticated: () => void;
}

export function Auth({ onAuthenticated }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Welcome back!");
      } else {
        await signup(email, password, name);
        // After signup, log them in
        await login(email, password);
        toast.success("Account created! Welcome!");
      }
      onAuthenticated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-end justify-center gap-3 mb-3">
            <img
              src={logo}
              alt="Proof of Grind Logo"
              className="h-16 w-16 rounded-2xl shadow-lg shadow-violet-500/20"
            />
            <h1
              className="text-4xl bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent pb-1"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              Proof of Grind
            </h1>
          </div>
          <p className="text-gray-400">Track your grind, flex your mind.</p>
        </div>

        <Card className="p-6 bg-gray-900/80 border-gray-800 backdrop-blur-sm">
          <div className="flex gap-2 mb-6">
            <Button
              variant={isLogin ? "default" : "ghost"}
              onClick={() => setIsLogin(true)}
              className={`flex-1 ${isLogin ? 'bg-gradient-to-r from-violet-600 to-indigo-600' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? "default" : "ghost"}
              onClick={() => setIsLogin(false)}
              className={`flex-1 ${!isLogin ? 'bg-gradient-to-r from-violet-600 to-indigo-600' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
            >
              Sign Up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              disabled={loading}
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          <p className="text-gray-500 text-xs text-center mt-4">
            Your data is stored securely and privately
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
