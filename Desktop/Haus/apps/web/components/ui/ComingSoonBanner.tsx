'use client';

import { motion } from 'framer-motion';
import { Clock, Star, Sparkles, Calendar, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GlowingIcon from '@/components/ui/GlowingIcon';

interface ComingSoonBannerProps {
  title: string;
  description?: string;
  estimatedRelease?: string;
  feature?: 'Week 3' | 'Week 4' | 'Week 5' | 'Future';
  className?: string;
}

export default function ComingSoonBanner({
  title,
  description,
  estimatedRelease,
  feature = 'Week 3',
  className = ''
}: ComingSoonBannerProps) {
  
  const kiwi = {
    primary: '#9AFF9A',
    secondary: '#7FFF7F', 
    dark: '#5FDF5F',
    glow: 'rgba(154, 255, 154, 0.5)'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3 }
      }}
      className={`
        relative overflow-hidden rounded-3xl p-8 text-center group
        backdrop-blur-xl border-2 border-transparent
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, 
          rgba(154, 255, 154, 0.15) 0%, 
          rgba(127, 255, 127, 0.10) 50%, 
          rgba(95, 223, 95, 0.15) 100%)`,
        borderImage: `linear-gradient(135deg, ${kiwi.primary}, ${kiwi.secondary}, ${kiwi.primary}) 1`,
        boxShadow: `
          0 0 30px ${kiwi.glow}, 
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 8px 32px rgba(0, 0, 0, 0.3)
        `
      }}
    >
      {/* Animated Kiwi Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${8 + Math.random() * 16}px`,
              height: `${8 + Math.random() * 16}px`,
              background: `radial-gradient(circle, ${kiwi.primary}80, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
              x: [-10, 10, -10],
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Pulsing Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${kiwi.primary}40, transparent 50%)`,
            `radial-gradient(circle at 70% 70%, ${kiwi.secondary}40, transparent 50%)`,
            `radial-gradient(circle at 30% 30%, ${kiwi.primary}40, transparent 50%)`,
          ]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        {/* Feature Badge */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Badge 
            className="font-tt-drugs-condensed uppercase tracking-wider px-4 py-2 text-sm font-bold"
            style={{
              background: `linear-gradient(45deg, ${kiwi.primary}30, ${kiwi.secondary}30)`,
              color: kiwi.dark,
              border: `1px solid ${kiwi.primary}50`,
              boxShadow: `0 0 15px ${kiwi.glow}`,
              textShadow: `0 0 10px ${kiwi.glow}`
            }}
          >
            <Rocket className="w-4 h-4 mr-2" />
            {feature} Features
          </Badge>
        </motion.div>

        {/* Main Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.3, 
            type: "spring", 
            stiffness: 200, 
            damping: 15 
          }}
        >
          <div className="relative">
            <motion.div
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${kiwi.primary}20, ${kiwi.secondary}10)`,
                border: `2px solid ${kiwi.primary}40`,
                boxShadow: `
                  0 0 30px ${kiwi.glow},
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `
              }}
              animate={{
                boxShadow: [
                  `0 0 30px ${kiwi.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                  `0 0 50px ${kiwi.primary}80, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                  `0 0 30px ${kiwi.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <GlowingIcon 
                icon={Sparkles} 
                size="xl" 
                variant="success" 
                animated={true}
              />
            </motion.div>
            
            {/* Floating elements */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: kiwi.primary,
                  left: `${-10 + i * 40}px`,
                  top: `${-10 + i * 15}px`,
                  boxShadow: `0 0 10px ${kiwi.glow}`
                }}
                animate={{
                  y: [-5, 5, -5],
                  opacity: [0.5, 1, 0.5],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2 
          className="text-3xl md:text-4xl font-bold font-tt-drugs mb-4"
          style={{ 
            color: kiwi.primary,
            textShadow: `0 0 20px ${kiwi.glow}` 
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {title}
        </motion.h2>

        {/* Description */}
        {description && (
          <motion.p 
            className="text-lg text-white/90 mb-8 max-w-lg mx-auto leading-relaxed font-tt-drugs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {description}
          </motion.p>
        )}

        {/* Release Timeline */}
        {estimatedRelease && (
          <motion.div
            className="inline-flex items-center space-x-3 px-6 py-3 rounded-2xl backdrop-blur-md"
            style={{
              background: `linear-gradient(45deg, ${kiwi.primary}15, ${kiwi.secondary}15)`,
              border: `1px solid ${kiwi.primary}30`,
              boxShadow: `0 0 20px ${kiwi.glow}`
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: [
                `0 0 20px ${kiwi.glow}`,
                `0 0 30px ${kiwi.primary}60`,
                `0 0 20px ${kiwi.glow}`
              ]
            }}
            transition={{ 
              opacity: { delay: 0.6 },
              scale: { delay: 0.6 },
              boxShadow: { duration: 3, repeat: Infinity }
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 40px ${kiwi.primary}80`
            }}
          >
            <GlowingIcon icon={Calendar} size="sm" variant="success" animated={false} />
            <span className="text-sm font-medium font-tt-drugs-condensed text-white uppercase tracking-wider">
              Coming {estimatedRelease}
            </span>
          </motion.div>
        )}

        {/* Corner Decoration */}
        <motion.div 
          className="absolute top-4 right-4 opacity-60"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 12, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
        >
          <Star 
            className="w-6 h-6" 
            style={{ 
              color: kiwi.secondary,
              filter: `drop-shadow(0 0 8px ${kiwi.glow})`
            }} 
          />
        </motion.div>
      </div>
    </motion.div>
  );
}