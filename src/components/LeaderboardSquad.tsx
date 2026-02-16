import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getLevel } from "@/data/gameData";
import { toast } from "sonner";

interface LeaderEntry {
  id: string;
  name: string;
  points: number;
  avatar: string;
}

export default function LeaderboardSquad({ currentUserId }: { currentUserId: string }) {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [leadersRes, profileRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, name, points, avatar")
          .order("points", { ascending: false })
          .limit(10),
        supabase
          .from("profiles")
          .select("referral_code")
          .eq("id", currentUserId)
          .maybeSingle(),
      ]);
      if (leadersRes.data) setLeaders(leadersRes.data);
      if (profileRes.data) setReferralCode(profileRes.data.referral_code);
      setLoading(false);
    };
    fetchData();
  }, [currentUserId]);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Kode referral disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const medals = ["🥇", "🥈", "🥉"];

  if (loading) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">Memuat leaderboard...</div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Invite Card */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card text-center space-y-2">
        <p className="font-black text-sm text-foreground">📨 Ajak Teman Gabung Geng!</p>
        <div className="flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-muted font-mono font-black text-foreground text-sm tracking-widest">
            {referralCode}
          </span>
          <button
            onClick={handleCopyReferral}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Tersalin!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card">
        <h3 className="text-base font-black text-foreground text-center mb-3">
          🏆 Geng Ramadan — Leaderboard Squad
        </h3>
        <div className="space-y-2">
          {leaders.map((entry, i) => {
            const level = getLevel(entry.points);
            const isMe = entry.id === currentUserId;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isMe
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-muted/40"
                }`}
              >
                <span className="text-lg w-7 text-center font-black">
                  {i < 3 ? medals[i] : `${i + 1}`}
                </span>
                <span className="text-2xl">{entry.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                    {entry.name} {isMe && "(Kamu)"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {level.emoji} {level.name}
                  </p>
                </div>
                <span className="font-black text-sm text-gold">{entry.points} ⭐</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
