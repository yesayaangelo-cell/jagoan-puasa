import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface LoginPageProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, name: string, ref: string | null) => Promise<void>;
}

export default function LoginPage({ onSignIn, onSignUp }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferralCode(ref);
      setIsSignUp(true); // Auto-switch to sign up form
      toast.info(`Kamu diajak oleh teman! Daftar untuk gabung gengnya.`);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (isSignUp && !name.trim()) return;

    setSubmitting(true);
    try {
      if (isSignUp) {
        await onSignUp(email.trim(), password, name.trim(), referralCode);
        toast.success("Akun berhasil dibuat! Cek email untuk verifikasi.");
      } else {
        await onSignIn(email.trim(), password);
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gradient-hero">
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
        transition={{
          scale: { type: "spring", stiffness: 260, damping: 20 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="mb-4"
      >
        <img
          src="https://i.ibb.co.com/N2Pm4GVK/Untitled-design.png"
          alt="Jagoan Puasa Logo"
          className="w-[280px] h-auto"
        />
      </motion.div>

      <motion.p
        className="text-primary-foreground/80 mb-6 text-center text-lg font-semibold"
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
        <div className="bg-card/20 backdrop-blur-md rounded-2xl p-6 space-y-3 border border-primary-foreground/20">
          <label className="block text-primary-foreground font-bold text-center text-lg">
            {isSignUp ? "Daftar Akun Baru 🎉" : "Masuk ke Akunmu 😄"}
          </label>

          {isSignUp && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu..."
              className="w-full px-4 py-3 rounded-xl bg-card text-foreground font-bold text-center placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email..."
            className="w-full px-4 py-3 rounded-xl bg-card text-foreground font-bold text-center placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password..."
            className="w-full px-4 py-3 rounded-xl bg-card text-foreground font-bold text-center placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary"
          />

          <motion.button
            type="submit"
            disabled={submitting || !email.trim() || !password.trim() || (isSignUp && !name.trim())}
            className="w-full py-4 rounded-xl gradient-gold text-gold-foreground font-black text-xl shadow-gold disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {submitting ? "Loading..." : isSignUp ? "DAFTAR! 🚀" : "MASUK! 🚀"}
          </motion.button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-primary-foreground/70 text-sm font-semibold underline"
          >
            {isSignUp ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
          </button>
        </div>
      </motion.form>

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
