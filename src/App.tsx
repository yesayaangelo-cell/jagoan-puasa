import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "@/hooks/usePlayer";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ShopPage from "@/pages/Shop";
import RamadanMap from "@/pages/RamadanMap";
import BottomNav from "@/components/BottomNav";

const App = () => {
  const { player, loading, login, addPoints, spendPoints, logout } = usePlayer();
  const [activeTab, setActiveTab] = useState<"home" | "map" | "shop">("home");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero">
        <motion.p
          className="text-4xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          🌙
        </motion.p>
      </div>
    );
  }

  if (!player) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="max-w-md mx-auto relative">
      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Dashboard player={player} onAddPoints={addPoints} />
          </motion.div>
        )}
        {activeTab === "map" && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <RamadanMap />
          </motion.div>
        )}
        {activeTab === "shop" && (
          <motion.div
            key="shop"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ShopPage player={player} onSpend={spendPoints} />
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />
    </div>
  );
};

export default App;
