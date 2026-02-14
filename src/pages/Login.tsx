import { useState } from "react";
import { motion } from "framer-motion";

interface LoginPageProps {
  onLogin: (name: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onLogin(name);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gradient-hero">
      {/* Decorative elements */}
      <motion.div
        className="text-6xl mb-2"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        🌙
      </motion.div>

      <motion.h1
        className="text-4xl font-black text-primary-foreground mb-2 text-center"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
      >
        Jagoan Puasa
      </motion.h1>

      <motion.p
        className="text-primary-foreground/80 mb-8 text-center text-lg font-semibold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        🏆 Kumpulkan poin, jadi juara Ramadan!
      </motion.p>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-xs space-y-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-card/20 backdrop-blur-md rounded-2xl p-6 space-y-4 border border-primary-foreground/20">
          <label className="block text-primary-foreground font-bold text-center text-lg">
            Siapa Nama Kamu? 😄
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ketik nama di sini..."
            className="w-full px-4 py-3.5 rounded-xl bg-card text-foreground font-bold text-center text-lg placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary"
            autoFocus
          />
          <motion.button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 rounded-xl gradient-gold text-gold-foreground font-black text-xl shadow-gold disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            MULAI! 🚀
          </motion.button>
        </div>
      </motion.form>

      {/* Bottom decorations */}
      <motion.div
        className="mt-8 flex gap-3 text-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        {["⭐", "🕌", "📖", "💝", "🤲"].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
