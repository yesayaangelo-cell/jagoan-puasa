import { motion } from "framer-motion";
import { Home, ShoppingBag, LogOut } from "lucide-react";

interface BottomNavProps {
  activeTab: "home" | "shop";
  onTabChange: (tab: "home" | "shop") => void;
  onLogout: () => void;
}

export default function BottomNav({ activeTab, onTabChange, onLogout }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
        <NavButton
          icon={<Home size={22} />}
          label="Home"
          active={activeTab === "home"}
          onClick={() => onTabChange("home")}
        />
        <NavButton
          icon={<ShoppingBag size={22} />}
          label="Toko"
          active={activeTab === "shop"}
          onClick={() => onTabChange("shop")}
        />
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-0.5 text-muted-foreground p-2 rounded-xl transition-colors hover:text-destructive"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-semibold">Keluar</span>
        </button>
      </div>
    </nav>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-colors ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -top-1 w-8 h-1 rounded-full gradient-hero"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}
