import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const handleUpgrade = () => {
    const link = document.createElement("a");
    link.href = "https://wa.me/6285157778929?text=Halo+Admin+saya+mau+Upgrade+Premium";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[340px] rounded-3xl border-gold bg-card p-0 overflow-hidden">
        <div className="gradient-gold px-6 pt-6 pb-4 text-center">
          <p className="text-4xl mb-2">⭐</p>
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-gold-foreground">
              Fitur Premium
            </DialogTitle>
            <DialogDescription className="text-gold-foreground/80 font-semibold text-sm">
              Upgrade untuk akses semua fitur!
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 pt-4 space-y-4">
          <div className="space-y-2 text-center">
            <p className="text-2xl font-black text-foreground">
              Rp 19.000
            </p>
            <p className="text-xs text-muted-foreground">Sekali bayar, selamanya Premium!</p>
          </div>

          <ul className="space-y-1.5 text-sm text-foreground">
            <li>✅ Tukar Poin di Toko Hadiah</li>
            <li>✅ Avatar Jagoan Eksklusif</li>
          </ul>

          <motion.button
            onClick={handleUpgrade}
            className="w-full py-3 rounded-2xl gradient-gold text-gold-foreground font-black text-sm shadow-gold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            💬 Chat WhatsApp untuk Upgrade
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
