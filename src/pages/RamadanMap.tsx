import { motion } from "framer-motion";
import { Lock, Star, MapPin } from "lucide-react";

// Set start of Ramadan to Feb 19, 2026, in the local timezone.
const RAMADAN_START = new Date(2026, 1, 19); // Month is 0-indexed (1 = February)
const TOTAL_DAYS = 30;

function getCurrentDay(): number {
  const now = new Date();
  // To ensure we are comparing just dates, set the time to the start of the day.
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = startOfToday.getTime() - RAMADAN_START.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(diffDays + 1, TOTAL_DAYS));
}


type NodeStatus = "completed" | "current" | "locked";

function getStatus(day: number, currentDay: number): NodeStatus {
  if (day < currentDay) return "completed";
  if (day === currentDay) return "current";
  return "locked";
}

const ORNAMENTS = [
  { day: 3, emoji: "☁️", x: "left-2", y: "-top-2" },
  { day: 7, emoji: "🌴", x: "right-2", y: "-top-1" },
  { day: 10, emoji: "🪘", x: "left-1", y: "top-0" },
  { day: 14, emoji: "🐪", x: "right-3", y: "-top-2" },
  { day: 18, emoji: "☁️", x: "left-3", y: "top-1" },
  { day: 22, emoji: "🧆", x: "right-1", y: "-top-1" },
  { day: 25, emoji: "🌙", x: "left-2", y: "top-0" },
  { day: 28, emoji: "🎆", x: "right-2", y: "-top-2" },
];

export default function RamadanMap() {
  const currentDay = getCurrentDay();

  // Build days array reversed so day 30 is at the top
  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => TOTAL_DAYS - i);

  return (
    <div
      className="min-h-screen pb-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(to top, hsl(200 70% 60%), hsl(240 50% 45%), hsl(270 60% 30%))",
      }}
    >
      {/* Title */}
      <div className="sticky top-0 z-10 px-5 pt-6 pb-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-primary-foreground drop-shadow-lg"
        >
          🗺️ Peta Petualangan Ramadan
        </motion.h2>
        <p className="text-primary-foreground/70 text-sm font-semibold">
          Hari ke-{currentDay} dari {TOTAL_DAYS}
        </p>
      </div>

      {/* Masjid at the top (Day 30 destination) */}
      <div className="flex justify-center mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-center"
        >
          <span className="text-6xl drop-shadow-lg">🕌</span>
          <p className="text-primary-foreground font-black text-xs mt-1 drop-shadow">LEBARAN!</p>
        </motion.div>
      </div>

      {/* Path */}
      <div className="relative px-6 pb-8">
        {days.map((day, index) => {
          const status = getStatus(day, currentDay);
          const isLeft = index % 2 === 0;
          const ornament = ORNAMENTS.find((o) => o.day === day);

          return (
            <div key={day} className="relative">
              {/* Connecting line */}
              {index < days.length - 1 && (
                <div
                  className="absolute w-0.5 left-1/2 -translate-x-1/2"
                  style={{
                    top: "50%",
                    height: "100%",
                    background:
                      status === "locked"
                        ? "hsl(0 0% 100% / 0.15)"
                        : "hsl(0 0% 100% / 0.4)",
                  }}
                />
              )}

              <motion.div
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.02 * index }}
                className={`flex items-center gap-3 py-2 ${
                  isLeft ? "flex-row pr-[40%]" : "flex-row-reverse pl-[40%]"
                }`}
              >
                {/* Node */}
                <div className="relative flex-shrink-0">
                  <DayNode day={day} status={status} />
                  {/* Ornament */}
                  {ornament && (
                    <span className="absolute -right-6 -top-3 text-2xl opacity-70 pointer-events-none">
                      {ornament.emoji}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div
                  className={`text-xs font-bold ${
                    status === "current"
                      ? "text-star"
                      : status === "completed"
                      ? "text-primary-foreground"
                      : "text-primary-foreground/40"
                  }`}
                >
                  <p>Hari {day}</p>
                  {day === 30 && (
                    <p className="text-[10px] text-primary-foreground/60">🎉 Lebaran!</p>
                  )}
                  {day === 15 && (
                    <p className="text-[10px] text-primary-foreground/60">🌙 Nuzulul Quran</p>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}

        {/* Start marker */}
        <div className="text-center mt-2">
          <span className="text-3xl">🚀</span>
          <p className="text-primary-foreground/70 font-black text-xs">MULAI!</p>
        </div>
      </div>
    </div>
  );
}

function DayNode({ day, status }: { day: number; status: NodeStatus }) {
  const baseSize = status === "current" ? "w-12 h-12" : "w-9 h-9";

  if (status === "locked") {
    return (
      <div
        className={`${baseSize} rounded-full flex items-center justify-center bg-primary-foreground/10 border border-primary-foreground/20`}
      >
        <Lock size={14} className="text-primary-foreground/30" />
      </div>
    );
  }

  if (status === "current") {
    return (
      <motion.div
        className={`${baseSize} rounded-full flex items-center justify-center border-2 border-star shadow-[0_0_15px_hsl(var(--star)/0.6)]`}
        style={{ background: "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--star)))" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <MapPin size={18} className="text-primary-foreground" />
      </motion.div>
    );
  }

  // completed
  return (
    <div
      className={`${baseSize} rounded-full flex items-center justify-center border border-accent/50`}
      style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)))" }}
    >
      <Star size={14} className="text-primary-foreground fill-primary-foreground" />
    </div>
  );
}
