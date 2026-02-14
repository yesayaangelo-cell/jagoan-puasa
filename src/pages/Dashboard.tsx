import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { Kid } from "@/types";
import { DEFAULT_MISSIONS, getLevel } from "@/data/gameData";

interface DashboardProps {
  player: Kid;
  onAddPoints: (pts: number) => void;
}

function getTodayKey(kidId: string) {
  const today = new Date().toISOString().slice(0, 10);
  return `jagoan_logs_${kidId}_${today}`;
}

function loadCompletedToday(kidId: string): Set<string> {
  try {
    const data = localStorage.getItem(getTodayKey(kidId));
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompletedToday(kidId: string, completed: Set<string>) {
  localStorage.setItem(getTodayKey(kidId), JSON.stringify([...completed]));
}

export default function Dashboard({ player, onAddPoints }: DashboardProps) {
  const [completedToday, setCompletedToday] = useState<Set<string>>(() => loadCompletedToday(player.id));
  const level = getLevel(player.points);

  const handleComplete = (missionId: string, points: number) => {
    if (completedToday.has(missionId)) return;

    // Sound effect
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch {}

    // Confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#a855f7", "#eab308", "#14b8a6", "#fff"],
    });

    onAddPoints(points);
    setCompletedToday((prev) => {
      const next = new Set(prev).add(missionId);
      saveCompletedToday(player.id, next);
      return next;
    });
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="gradient-hero px-5 pt-8 pb-10 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-6"
        >
          <img 
            src="https://i.ibb.co.com/N2Pm4GVK/Untitled-design.png" 
            alt="Jagoan Puasa Logo" 
            className="w-[200px] h-auto mb-4"
          />
          <div className="flex flex-col items-center gap-2">
            <div>
              <p className="text-primary-foreground/80 text-sm font-semibold">Assalamu'alaikum 👋</p>
              <h2 className="text-2xl font-black text-primary-foreground">{player.name}</h2>
            </div>
            <motion.div
              className="px-3 py-1.5 rounded-full bg-card/20 backdrop-blur-sm border border-primary-foreground/20"
              whileHover={{ scale: 1.05 }}
            >
              <span className={`font-bold text-sm text-primary-foreground`}>
                {level.emoji} {level.name}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Points Card */}
        <motion.div
          className="bg-card/20 backdrop-blur-md rounded-2xl p-5 border border-primary-foreground/20 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <p className="text-primary-foreground/80 text-sm font-semibold mb-1">Total Poin ⭐</p>
          <motion.p
            key={player.points}
            className="text-5xl font-black text-primary-foreground"
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {player.points}
          </motion.p>
        </motion.div>
      </div>

      {/* Missions */}
      <div className="px-5 mt-6">
        <h3 className="text-lg font-black text-foreground mb-1 text-center">📋 Misi Hari Ini</h3>
        <p className="text-xs text-gold/80 italic text-center mb-4 px-4 leading-tight">
          "Jagoan sejati itu jujur sama Allah & diri sendiri. Klik 'Selesai' cuma kalau kamu beneran udah ngerjain ya! 💪"
        </p>
        <div className="space-y-3">
          <AnimatePresence>
            {DEFAULT_MISSIONS.map((mission, i) => {
              const done = completedToday.has(mission.id);
              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                    done
                      ? "bg-accent/10 border-accent/30 opacity-70"
                      : "bg-card shadow-card border-border"
                  }`}
                >
                  <span className="text-3xl">{mission.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {mission.title}
                    </p>
                    <p className="text-sm text-gold font-bold">+{mission.points} poin</p>
                  </div>
                  <motion.button
                    onClick={() => handleComplete(mission.id, mission.points)}
                    disabled={done}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      done
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "gradient-teal text-accent-foreground shadow-sm"
                    }`}
                    whileHover={done ? {} : { scale: 1.05 }}
                    whileTap={done ? {} : { scale: 0.95 }}
                  >
                    {done ? "Sudah Beres ✅" : "Selesai"}
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
