import { useState, useEffect } from 'preact/hooks';
import { 
  Trophy, 
  RefreshCw, 
  Medal, 
  Award,
  AlertTriangle,
  Settings,
  FileSpreadsheet
} from 'lucide-preact';

interface LeaderboardEntry {
  name: string;
  avgQueueTime: number;
  score: number;
  badge: string;
  timestamp: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://vending-be.vercel.app/api/leaderboard?limit=10');
      const data = await response.json();
      
      if (data.success && data.leaderboard) {
        setLeaderboard(data.leaderboard);
      } else {
        
        setLeaderboard([
          { name: 'Sample Player 1', avgQueueTime: 0.5, score: 78, badge: 'Vending Hero', timestamp: '2026-01-11' },
          { name: 'Sample Player 2', avgQueueTime: 1.2, score: 55, badge: 'Queue Master', timestamp: '2026-01-10' },
          { name: 'Sample Player 3', avgQueueTime: 2.5, score: 37, badge: 'Efficiency Pro', timestamp: '2026-01-09' },
        ]);
        setError('Google Sheets belum dikonfigurasi. Menampilkan data contoh.');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLeaderboard([
        { name: 'Demo Player', avgQueueTime: 0.8, score: 67, badge: 'Vending Hero', timestamp: '2026-01-11' },
      ]);
      setError('Tidak dapat terhubung ke server. Menampilkan data demo.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Medal class="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal class="w-6 h-6 text-gray-300" />;
      case 3: return <Medal class="w-6 h-6 text-amber-600" />;
      default: return <span class="text-white/50 font-mono">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30';
      case 3: return 'bg-gradient-to-r from-amber-700/20 to-orange-700/20 border-amber-700/30';
      default: return 'bg-dark-300/30 border-white/5';
    }
  };

  return (
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display text-xl font-bold gradient-text flex items-center gap-2">
          <Trophy class="w-5 h-5" />
          Leaderboard
        </h3>
        <button
          onClick={fetchLeaderboard}
          class="px-3 py-1.5 rounded-lg bg-dark-300/50 hover:bg-dark-200 text-sm transition-colors flex items-center gap-2"
        >
          <RefreshCw class="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div class="mb-4 p-3 rounded-lg bg-warning-500/10 border border-warning-500/20 text-warning-300 text-sm flex items-center gap-2">
          <AlertTriangle class="w-4 h-4" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div class="flex items-center justify-center py-12">
          <RefreshCw class="w-10 h-10 text-primary-400 animate-spin" />
        </div>
      ) : leaderboard.length === 0 ? (
        <div class="text-center py-12 text-white/60">
          <Trophy class="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <p>Belum ada data di leaderboard.</p>
          <p class="text-sm mt-2">Jadilah yang pertama dengan menjalankan simulasi!</p>
        </div>
      ) : (
        <div class="space-y-3">
          {leaderboard.map((entry, index) => {
            const rank = index + 1;
            return (
              <div
                key={index}
                class={`
                  p-4 rounded-xl border transition-all hover:scale-[1.02]
                  ${getRankStyle(rank)}
                `}
              >
                <div class="flex items-center gap-4">
                  
                  <div class="w-12 flex items-center justify-center">
                    {getRankIcon(rank)}
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-white truncate">
                        {entry.name}
                      </span>
                      <span class="text-sm flex items-center gap-1">
                        <Award class="w-3 h-3" />
                        {entry.badge}
                      </span>
                    </div>
                    <div class="text-xs text-white/50 mt-1">
                      {entry.timestamp}
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="text-xl font-bold text-primary-400">
                      {entry.score}
                      <span class="text-sm text-white/40"> pts</span>
                    </div>
                    <div class="text-xs text-white/50">
                      {entry.avgQueueTime.toFixed(2)} min avg
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div class="mt-6 p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
        <h4 class="font-semibold text-primary-300 mb-2 flex items-center gap-2">
          <FileSpreadsheet class="w-4 h-4" />
          Setup Google Sheets
        </h4>
        <ol class="text-sm text-white/60 space-y-1 list-decimal list-inside">
          <li>Buat project di Google Cloud Console, enable Sheets API</li>
          <li>Buat Service Account dan download credentials JSON</li>
          <li>Share spreadsheet dengan email service account</li>
          <li>Set environment variables di backend (.env)</li>
        </ol>
      </div>
    </div>
  );
}
