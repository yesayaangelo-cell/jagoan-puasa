import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { Profile } from "@/hooks/usePlayer";
import { DEFAULT_REWARDS } from "@/data/gameData";

interface ShopPageProps {
  player: Profile;
  onSpend: (pts: number) => Promise<boolean>;
}

export default function ShopPage({ player, onSpend }: ShopPageProps) {
  const [showTicket, setShowTicket] = useState<string | null>(null);
  const [boughtItems, setBoughtItems] = useState<Set<string>>(new Set());

  const handleBuy = async (rewardId: string, cost: number, title: string) => {
    if (player.points < cost) return;

    const success = await onSpend(cost);
    if (!success) return;

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 },
      colors: ["#eab308", "#fbbf24", "#f59e0b"],
    });

    setBoughtItems((prev) => new Set(prev).add(rewardId));
    setShowTicket(title);
    setTimeout(() => setShowTicket(null), 2500);
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="gradient-gold px-5 pt-8 pb-8 rounded-b-[2rem]">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-gold-foreground">🏪 Toko Hadiah</h2>
          <p className="text-gold-foreground/80 font-semibold text-sm">
            Poin kamu: <span className="font-black text-lg">{player.points} ⭐</span>
          </p>
        </motion.div>
      </div>

      {/* Rewards */}
      <div className="px-5 mt-6 space-y-3">
        {DEFAULT_REWARDS.map((reward, i) => {
          const canBuy = player.points >= reward.cost && !boughtItems.has(reward.id);
          const bought = boughtItems.has(reward.id);
          const isGrand = reward.isGrandPrize;

          if (isGrand) {
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`relative p-5 rounded-2xl border-2 transition-all overflow-hidden ${
                  bought
                    ? "border-accent/30 opacity-70"
                    : "border-gold shadow-[0_0_20px_hsl(var(--gold)/0.4)]"
                }`}
                style={{
                  background: bought
                    ? "hsl(var(--accent) / 0.1)"
                    : "linear-gradient(135deg, hsl(var(--gold) / 0.15), hsl(var(--card)))",
                }}
              >
                {!bought && (
                  <div className="absolute inset-0 rounded-2xl animate-pulse pointer-events-none border-2 border-gold/30" />
                )}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs font-black tracking-widest text-gold uppercase">🏆 Grand Prize</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{reward.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-black text-lg ${bought ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {reward.title}
                    </p>
                    <p className="text-gold font-black text-base">{reward.cost} poin ⭐</p>
                    <p className="text-xs text-muted-foreground italic mt-1">
                      Hadiah Utama! Syarat: Puasa TIDAK BOLEH BOLONG (Full 30 Hari). Kalau bolong, poin hangus!
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleBuy(reward.id, reward.cost, reward.title)}
                  disabled={!canBuy}
                  className={`w-full mt-3 px-4 py-3 rounded-xl font-black text-sm transition-all ${
                    bought
                      ? "bg-accent/20 text-accent"
                      : canBuy
                      ? "gradient-gold text-gold-foreground shadow-gold"
                      : "bg-muted text-muted-foreground"
                  }`}
                  whileHover={canBuy ? { scale: 1.03 } : {}}
                  whileTap={canBuy ? { scale: 0.97 } : {}}
                >
                  {bought ? "✅ Dibeli" : `Tukar ${reward.cost} Poin`}
                </motion.button>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                bought
                  ? "bg-accent/10 border-accent/30 opacity-70"
                  : "bg-card shadow-card border-border"
              }`}
            >
              <span className="text-3xl">{reward.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-bold ${bought ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {reward.title}
                </p>
                <p className="text-sm text-gold font-bold">{reward.cost} poin</p>
              </div>
              <motion.button
                onClick={() => handleBuy(reward.id, reward.cost, reward.title)}
                disabled={!canBuy}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  bought
                    ? "bg-accent/20 text-accent"
                    : canBuy
                    ? "gradient-hero text-primary-foreground shadow-button"
                    : "bg-muted text-muted-foreground"
                }`}
                whileHover={canBuy ? { scale: 1.05 } : {}}
                whileTap={canBuy ? { scale: 0.95 } : {}}
              >
                {bought ? "✅ Dibeli" : "Beli"}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Golden Ticket Overlay */}
      <AnimatePresence>
        {showTicket && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="gradient-gold p-8 rounded-3xl text-center shadow-gold"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <p className="text-5xl mb-3">🎫</p>
              <p className="text-xl font-black text-gold-foreground">Selamat!</p>
              <p className="text-gold-foreground/80 font-bold">{showTicket} berhasil dibeli!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
