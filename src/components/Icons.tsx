import { 
  Gamepad2,
  Target,
  BarChart3,
  Dice5,
  Trophy,
  BookOpen,
  Lightbulb,
  Settings,
  Play,
  BarChart,
  SlidersHorizontal
} from 'lucide-preact';

export function GamepadIcon() {
  return <Gamepad2 class="w-4 h-4 inline-block mr-1" />;
}

export function TargetIcon() {
  return (
    <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-primary-500/20 flex items-center justify-center">
      <Target class="w-6 h-6 text-primary-400" />
    </div>
  );
}

export function ChartIcon() {
  return (
    <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-accent-500/20 flex items-center justify-center">
      <BarChart3 class="w-6 h-6 text-accent-400" />
    </div>
  );
}

export function DiceIcon() {
  return (
    <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-success-500/20 flex items-center justify-center">
      <Dice5 class="w-6 h-6 text-success-400" />
    </div>
  );
}

export function TrophyIcon() {
  return (
    <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-warning-500/20 flex items-center justify-center">
      <Trophy class="w-6 h-6 text-warning-400" />
    </div>
  );
}

export function BookIcon() {
  return <BookOpen class="w-5 h-5 inline-block mr-2" />;
}

export function LightbulbIcon() {
  return <Lightbulb class="w-4 h-4 inline-block mr-1 text-warning-400" />;
}

export function SettingsIcon() {
  return <SlidersHorizontal class="w-5 h-5 inline-block mr-2" />;
}

export function StepOneIcon() {
  return (
    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center">
      <SlidersHorizontal class="w-8 h-8 text-primary-400" />
    </div>
  );
}

export function StepTwoIcon() {
  return (
    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-500/20 flex items-center justify-center">
      <Play class="w-8 h-8 text-accent-400" />
    </div>
  );
}

export function StepThreeIcon() {
  return (
    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-success-500/20 flex items-center justify-center">
      <BarChart class="w-8 h-8 text-success-400" />
    </div>
  );
}

export function HowToPlayIcon() {
  return <Target class="w-5 h-5 inline-block mr-2" />;
}
