const SUPABASE_URL = "https://knmigjqlfoyoiitxcbal.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtubWlnanFsZm95b2lpdHhjYmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTM2NzUsImV4cCI6MjA4NjcyOTY3NX0.XXiSjtXrN5qrX6Mpy8eT4GNc8Po_OXr6UhiAlwCYrCg";

async function cekDatabase() {
  console.log("⏳ Menghubungkan ke markas rahasia Jagoan Puasa...\n");
  
  try {
    // Tembak langsung ke tabel 'profiles' pakai API Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error("Gagal nembus pertahanan: " + response.statusText);
    }

    const data = await response.json();

    if (data.length === 0) {
      console.log("🏜️ Sedih Bro... Belum ada satupun Jagoan yang daftar/main.");
      return;
    }

    // Kalau ada datanya, kita print jadi tabel keren
    console.log(`🔥 BOOM! Ketemu ${data.length} Pasukan Jagoan:\n`);
    
    const rapi = data.map(user => ({
      "Nama Pasukan": user.name || "Anonim",
      "Poin Bintang ⭐": user.points,
      "Status Akun": user.is_premium ? "Premium 👑" : "Gratisan",
      "User ID": user.id.substring(0, 8) + '...'
    }));

    console.table(rapi);
    
  } catch (err) {
    console.error("❌ Waduh Error Bro:", err.message);
  }
}

cekDatabase();