import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileResult {
  id: string;
  name: string;
  points: number;
  is_premium: boolean;
}

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<ProfileResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "enzo123") {
      setAuthenticated(true);
    } else {
      toast.error("Password salah!");
    }
  };

  const callAdmin = async (action: string) => {
    if (!userId.trim()) {
      toast.error("Masukkan User ID dulu");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-premium", {
        body: { action, password: "enzo123", userId: userId.trim() },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      if (action === "check") {
        setProfile(data.profile);
        toast.success("Data ditemukan!");
      } else {
        toast.success(action === "activate" ? "Premium AKTIF! ✅" : "Premium NONAKTIF ❌");
        // Refresh
        const { data: refreshed } = await supabase.functions.invoke("admin-premium", {
          body: { action: "check", password: "enzo123", userId: userId.trim() },
        });
        if (refreshed?.profile) setProfile(refreshed.profile);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card p-8 rounded-2xl shadow-card border border-border w-full max-w-sm space-y-4"
        >
          <h2 className="text-xl font-black text-foreground text-center">🔐 Admin Panel</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password admin..."
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl gradient-hero text-primary-foreground font-black"
          >
            MASUK
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-foreground text-center">🛡️ Admin Panel</h2>
          <p className="text-muted-foreground text-sm text-center">Kelola Premium Membership</p>
        </motion.div>

        {/* User ID Input */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-card space-y-3">
          <label className="text-sm font-bold text-foreground">Paste User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="contoh: a1b2c3d4-e5f6-..."
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => callAdmin("check")}
            disabled={loading || !userId.trim()}
            className="w-full py-3 rounded-xl gradient-gold text-gold-foreground font-black disabled:opacity-40"
          >
            {loading ? "Loading..." : "🔍 CEK STATUS"}
          </button>
        </div>

        {/* Profile Result */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-5 rounded-2xl border border-border shadow-card space-y-3"
          >
            <h3 className="font-black text-foreground">📋 Data User</h3>
            <div className="space-y-1 text-sm">
              <p className="text-foreground"><span className="text-muted-foreground">Nama:</span> <strong>{profile.name}</strong></p>
              <p className="text-foreground"><span className="text-muted-foreground">Poin:</span> <strong>{profile.points} ⭐</strong></p>
              <p className="text-foreground">
                <span className="text-muted-foreground">Status:</span>{" "}
                <strong className={profile.is_premium ? "text-gold" : "text-destructive"}>
                  {profile.is_premium ? "⭐ PREMIUM" : "❌ Belum Premium"}
                </strong>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => callAdmin("activate")}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground font-black text-sm disabled:opacity-40"
              >
                ✅ AKTIFKAN
              </button>
              <button
                onClick={() => callAdmin("deactivate")}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-black text-sm disabled:opacity-40"
              >
                ❌ MATIKAN
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
