import type { Mission, Reward } from "@/types";

export const DEFAULT_MISSIONS: Mission[] = [
  { id: "m1", title: "Sahur Tepat Waktu", points: 50, icon: "🌙" },
  { id: "m2", title: "Sholat 5 Waktu", points: 100, icon: "🕌" },
  { id: "m3", title: "Baca Al-Quran", points: 75, icon: "📖" },
  { id: "m4", title: "Sedekah Hari Ini", points: 80, icon: "💝" },
  { id: "m5", title: "Bantu Orang Tua", points: 60, icon: "🏠" },
  { id: "m6", title: "Puasa Full!", points: 150, icon: "⭐" },
  { id: "m7", title: "Doa Sebelum Makan", points: 30, icon: "🤲" },
  { id: "m8", title: "Tidak Marah", points: 40, icon: "😊" },
];

export const DEFAULT_REWARDS: Reward[] = [
  { id: "r1", title: "Es Krim 🍦", cost: 200, icon: "🍦" },
  { id: "r2", title: "Mainan Baru 🎮", cost: 1000, icon: "🎮" },
  { id: "r3", title: "Buku Cerita 📚", cost: 300, icon: "📚" },
  { id: "r4", title: "Jalan-Jalan 🎡", cost: 1500, icon: "🎡" },
  { id: "r5", title: "Stiker Keren ✨", cost: 100, icon: "✨" },
];

export function getLevel(points: number): { name: string; emoji: string; color: string } {
  if (points >= 1000) return { name: "Sultan", emoji: "👑", color: "text-star" };
  if (points >= 500) return { name: "Pejuang", emoji: "⚔️", color: "text-teal" };
  return { name: "Pemula", emoji: "🌱", color: "text-primary" };
}
