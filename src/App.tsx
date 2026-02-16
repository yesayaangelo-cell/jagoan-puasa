import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "@/hooks/usePlayer";
import { Toaster } from "sonner";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ShopPage from "@/pages/Shop";
import RamadanMap from "@/pages/RamadanMap";
import AdminPanel from "@/pages/AdminPanel";
import BottomNav from "@/components/BottomNav";

function MainApp() {
  const { user, profile, loading, signUp, signIn, addPoints, spendPoints, logout } = usePlayer();
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

  if (!user || !profile) {
    return <LoginPage onSignIn={signIn} onSignUp={signUp} />;
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
            <Dashboard player={profile} userId={user.id} onAddPoints={addPoints} />
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
            <ShopPage player={profile} onSpend={spendPoints} />
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <Toaster position="top-center" richColors />
    <Routes>
      <Route path="/admin-panel-rahasia" element={<AdminPanel />} />
      <Route path="/*" element={<MainApp />} />
    </Routes>
  </BrowserRouter>
);

export default App;
