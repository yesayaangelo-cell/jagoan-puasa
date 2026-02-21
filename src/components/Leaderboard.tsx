
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LeaderboardEntry = {
  id: string;
  name: string;
  avatar_url: string | null;
  points: number;
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, avatar_url, points")
          .order("points", { ascending: false })
          .limit(10);

        if (error) {
          throw error;
        }

        if (data) {
          setLeaderboard(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400 text-yellow-900";
      case 2:
        return "bg-gray-300 text-gray-800";
      case 3:
        return "bg-yellow-600 text-yellow-100";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };
  
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }


  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Peringkat Global</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Memuat papan peringkat...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Peringkat Global</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Gagal memuat papan peringkat: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏆 Peringkat Global</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {leaderboard.map((user, index) => (
            <li
              key={user.id}
              className={`flex items-center justify-between p-3 rounded-lg ${getRankColor(index + 1)}`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold w-6">{index + 1}</span>
                <Avatar>
                  <AvatarImage src={user.avatar_url || ''} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </div>
              <span className="font-bold text-lg">{user.points} ⭐</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
