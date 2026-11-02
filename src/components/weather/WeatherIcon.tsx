import { motion, useReducedMotion } from 'framer-motion';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Moon, Sun } from 'lucide-react';
import type { WeatherIconKey } from '@/utils/weather';
import { cn } from '@/lib/utils';

const ICONS = { sun: Sun, moon: Moon, partly: CloudSun, cloud: Cloud, fog: CloudFog, drizzle: CloudDrizzle, rain: CloudRain, snow: CloudSnow, storm: CloudLightning };

export function WeatherIcon({ icon, className, animated = true }: { icon: WeatherIconKey; className?: string; animated?: boolean }) {
  const reduce = useReducedMotion();
  const Icon = ICONS[icon];
  const anim = !animated || reduce
    ? undefined
    : icon === 'sun'
      ? { rotate: [0, 360] }
      : icon === 'storm'
        ? { opacity: [1, 0.6, 1] }
        : { y: [0, -3, 0] };
  const transition = icon === 'sun' ? { duration: 30, repeat: Infinity, ease: 'linear' as const } : { duration: 3, repeat: Infinity, ease: 'easeInOut' as const };
  const color = icon === 'sun' ? 'text-amber-400' : icon === 'moon' ? 'text-indigo-300' : icon === 'storm' ? 'text-violet-400' : icon === 'rain' || icon === 'drizzle' ? 'text-sky-400' : 'text-slate-400';
  return (
    <motion.span className={cn('inline-flex', color, className)} animate={anim} transition={transition} aria-hidden="true">
      <Icon className="h-full w-full" />
    </motion.span>
  );
}
