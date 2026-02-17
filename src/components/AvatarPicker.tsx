import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DICEBEAR_SEEDS = [
  "Felix", "Aneka", "Lily", "Max", "Zoe", "Milo", "Luna", "Leo",
  "Nadia", "Omar", "Sari", "Rafi", "Aisha", "Budi", "Citra",
  "Dimas", "Eka", "Fajar", "Gita", "Hana", "Indra", "Joko",
  "Kiki", "Laras", "Maya", "Nisa",
];

function getDiceBearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/micah/svg?seed=${seed}`;
}

interface AvatarPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar: string;
  userId: string;
  onAvatarChange: (avatar: string) => void;
}

export default function AvatarPicker({
  open,
  onOpenChange,
  currentAvatar,
  userId,
  onAvatarChange,
}: AvatarPickerProps) {
  const [selected, setSelected] = useState(currentAvatar);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ avatar: selected })
      .eq("id", userId);

    if (error) {
      toast.error("Gagal simpan avatar!");
    } else {
      toast.success("Avatar berhasil diganti! 🎉");
      onAvatarChange(selected);
      onOpenChange(false);
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-black">
            🎨 Pilih Avatar Jagoan
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-2 py-4">
          {DICEBEAR_SEEDS.map((seed) => {
            const url = getDiceBearUrl(seed);
            const isSelected = selected === url;
            return (
              <motion.button
                key={seed}
                onClick={() => setSelected(url)}
                className={`p-2 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border bg-muted/40 hover:border-primary/50"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <img
                  src={url}
                  alt={seed}
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                />
              </motion.button>
            );
          })}
        </div>
        <motion.button
          onClick={handleSave}
          disabled={saving || selected === currentAvatar}
          className="w-full py-3 rounded-2xl gradient-gold text-gold-foreground font-black text-sm shadow-gold disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? "Menyimpan..." : "Pakai Avatar Ini ✅"}
        </motion.button>
      </DialogContent>
    </Dialog>
  );
}
