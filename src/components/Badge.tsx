import type { Badge as BadgeType } from './stores/simulationStore';
import { Trophy, Star, BarChart3, Users, AlertTriangle, Sparkles, Crown } from 'lucide-preact';

interface BadgeProps {
  badge: BadgeType;
  score: number;
}

export default function Badge({ badge, score }: BadgeProps) {
  const getBadgeTier = () => {
    if (badge.name === 'Vending Hero') return 'legendary';
    if (badge.name === 'Queue Master') return 'epic';
    if (badge.name === 'Efficiency Pro') return 'rare';
    if (badge.name === 'Crowd Manager') return 'common';
    return 'basic';
  };

  const tier = getBadgeTier();

  const getBadgeIcon = () => {
    switch (badge.name) {
      case 'Vending Hero': return Trophy;
      case 'Queue Master': return Star;
      case 'Efficiency Pro': return BarChart3;
      case 'Crowd Manager': return Users;
      default: return AlertTriangle;
    }
  };

  const BadgeIcon = getBadgeIcon();

  const tierStyles = {
    legendary: {
      bg: 'bg-gradient-to-br from-yellow-500/30 via-amber-500/30 to-orange-500/30',
      border: 'border-yellow-400/50',
      glow: 'shadow-[0_0_30px_rgba(234,179,8,0.4)]',
      text: 'text-yellow-300',
      ring: 'ring-yellow-400/30',
      iconColor: 'text-yellow-400'
    },
    epic: {
      bg: 'bg-gradient-to-br from-purple-500/30 via-violet-500/30 to-fuchsia-500/30',
      border: 'border-purple-400/50',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]',
      text: 'text-purple-300',
      ring: 'ring-purple-400/30',
      iconColor: 'text-purple-400'
    },
    rare: {
      bg: 'bg-gradient-to-br from-blue-500/30 via-cyan-500/30 to-sky-500/30',
      border: 'border-blue-400/50',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      text: 'text-blue-300',
      ring: 'ring-blue-400/30',
      iconColor: 'text-blue-400'
    },
    common: {
      bg: 'bg-gradient-to-br from-gray-500/30 via-slate-500/30 to-zinc-500/30',
      border: 'border-gray-400/50',
      glow: '',
      text: 'text-gray-300',
      ring: 'ring-gray-400/30',
      iconColor: 'text-gray-400'
    },
    basic: {
      bg: 'bg-gradient-to-br from-red-500/30 via-rose-500/30 to-pink-500/30',
      border: 'border-red-400/50',
      glow: '',
      text: 'text-red-300',
      ring: 'ring-red-400/30',
      iconColor: 'text-red-400'
    }
  };

  const style = tierStyles[tier];

  return (
    <div class={`
      relative p-6 rounded-2xl border-2 
      ${style.bg} ${style.border} ${style.glow}
      transform hover:scale-105 transition-all duration-300
      ring-4 ${style.ring}
    `}>
      {tier === 'legendary' && (
        <>
          <Sparkles class="absolute top-2 left-2 w-4 h-4 text-yellow-300 animate-pulse" />
          <Sparkles class="absolute top-2 right-2 w-4 h-4 text-yellow-300 animate-pulse" style="animation-delay: 0.5s" />
          <Sparkles class="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 text-yellow-300 animate-pulse" style="animation-delay: 1s" />
        </>
      )}

      <div class="text-center">
        <div class={`w-16 h-16 mx-auto mb-3 rounded-full ${style.bg} ${style.border} border-2 flex items-center justify-center`}>
          <BadgeIcon class={`w-8 h-8 ${style.iconColor}`} />
        </div>
        <h3 class={`font-display text-xl font-bold ${style.text} mb-1`}>
          {badge.name}
        </h3>
        
        <p class="text-sm text-white/60 mb-4">
          {badge.description}
        </p>
        <div class="inline-block">
          <div class="relative">
            <div class={`
              px-6 py-3 rounded-xl 
              bg-dark-400/80 border ${style.border}
              ${tier === 'legendary' ? 'animate-pulse-slow' : ''}
            `}>
              <span class="text-xs text-white/50 block">SCORE</span>
              <span class={`font-display text-3xl font-bold ${style.text}`}>
                {score}
              </span>
              <span class="text-white/40 text-sm">/100</span>
            </div>
            
            <div class="mt-2 h-2 bg-dark-400 rounded-full overflow-hidden">
              <div 
                class={`h-full transition-all duration-1000 rounded-full ${
                  score >= 80 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                  score >= 60 ? 'bg-gradient-to-r from-purple-500 to-violet-500' :
                  score >= 40 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                  score >= 20 ? 'bg-gradient-to-r from-gray-500 to-slate-500' :
                  'bg-gradient-to-r from-red-500 to-rose-500'
                }`}
                style={`width: ${score}%`}
              />
            </div>
          </div>
        </div>

        <div class={`mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${style.text} ${style.bg} border ${style.border}`}>
          {tier === 'legendary' && <><Crown class="w-3 h-3" /> Legendary</>}
          {tier === 'epic' && <><Star class="w-3 h-3" /> Epic</>}
          {tier === 'rare' && <><BarChart3 class="w-3 h-3" /> Rare</>}
          {tier === 'common' && <><Users class="w-3 h-3" /> Common</>}
          {tier === 'basic' && <><AlertTriangle class="w-3 h-3" /> Basic</>}
        </div>
      </div>
    </div>
  );
}
