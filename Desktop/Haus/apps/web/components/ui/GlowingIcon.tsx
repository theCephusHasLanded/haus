'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlowingIconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'cosmic';
  animated?: boolean;
  className?: string;
}

export default function GlowingIcon({ 
  icon: Icon, 
  size = 'md', 
  variant = 'cosmic',
  animated = true,
  className 
}: GlowingIconProps) {
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const variantStyles = {
    primary: {
      color: '#3b82f6',
      glow: '0 0 20px rgba(59, 130, 246, 0.5)',
      shadow: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
    },
    secondary: {
      color: '#64748b',
      glow: '0 0 20px rgba(100, 116, 139, 0.5)',
      shadow: 'drop-shadow(0 0 8px rgba(100, 116, 139, 0.3))'
    },
    success: {
      color: '#22c55e',
      glow: '0 0 20px rgba(34, 197, 94, 0.5)',
      shadow: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.3))'
    },
    warning: {
      color: '#f59e0b',
      glow: '0 0 20px rgba(245, 158, 11, 0.5)',
      shadow: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.3))'
    },
    error: {
      color: '#ef4444',
      glow: '0 0 20px rgba(239, 68, 68, 0.5)',
      shadow: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.3))'
    },
    cosmic: {
      color: '#00ffff',
      glow: '0 0 20px rgba(0, 255, 255, 0.5)',
      shadow: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.3))'
    }
  };

  const style = variantStyles[variant];

  const animations = animated ? {
    initial: { 
      scale: 1,
      filter: style.shadow,
      boxShadow: style.glow
    },
    animate: {
      scale: [1, 1.05, 1],
      filter: [
        style.shadow,
        `drop-shadow(0 0 12px ${style.color.replace(')', ', 0.5)')})`,
        style.shadow
      ],
      boxShadow: [
        style.glow,
        style.glow.replace('0.5', '0.8'),
        style.glow
      ]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {
    initial: {
      filter: style.shadow,
      boxShadow: style.glow
    }
  };

  return (
    <motion.div
      className={cn("inline-flex items-center justify-center", className)}
      {...animations}
      whileHover={animated ? {
        scale: 1.1,
        filter: `drop-shadow(0 0 15px ${style.color.replace(')', ', 0.7)')})`,
      } : undefined}
      whileTap={animated ? { scale: 0.95 } : undefined}
    >
      <Icon 
        className={cn(sizeClasses[size])}
        style={{ 
          color: style.color,
          filter: style.shadow
        }}
      />
    </motion.div>
  );
}

// Export additional icon utilities
export function createGlowingIcon(IconComponent: LucideIcon, defaultVariant: GlowingIconProps['variant'] = 'cosmic') {
  return (props: Omit<GlowingIconProps, 'icon'>) => (
    <GlowingIcon icon={IconComponent} variant={defaultVariant} {...props} />
  );
}