'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, Sparkles, Home, User, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AirbnbCosmicWrapperProps {
  children: React.ReactNode;
}

export default function AirbnbCosmicWrapper({ children }: AirbnbCosmicWrapperProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Cosmic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated star field */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Cosmic nebula effect */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-transparent to-purple-900/10" />
        
        {/* Floating cosmic orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full opacity-5"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              left: `${20 + i * 20}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Airbnb-inspired Cosmic Header */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "backdrop-blur-xl bg-black/80 border-b border-white/10 shadow-2xl" 
            : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Cosmic Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="relative">
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center"
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 20px rgba(0, 0, 0, 0.3)'
                  }}
                  animate={{
                    boxShadow: [
                      'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 20px rgba(0, 0, 0, 0.3)',
                      'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 30px rgba(255, 255, 255, 0.1)',
                      'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 20px rgba(0, 0, 0, 0.3)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-white" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))' }} />
                </motion.div>
                {/* Glowing dots */}
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      '0 0 10px rgba(34, 211, 238, 0.5)',
                      '0 0 20px rgba(34, 211, 238, 0.8)',
                      '0 0 10px rgba(34, 211, 238, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold font-tt-drugs text-white tracking-tight">
                  Cepheus
                </h1>
                <p className="text-xs font-tt-drugs-condensed text-gray-400 uppercase tracking-wider">
                  Constellation
                </p>
              </div>
            </motion.div>

            {/* Airbnb-style Search Bar */}
            <motion.div 
              className="hidden md:flex items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div 
                  className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 space-x-4 transition-all duration-300 hover:bg-white/15 hover:border-white/30"
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 20px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="text-sm font-tt-drugs text-white">Anywhere</div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="text-sm font-tt-drugs text-white">Any week</div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="text-sm font-tt-drugs text-gray-400">Add guests</div>
                  <motion.div 
                    className="bg-white/20 p-2 rounded-full"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right Side Menu */}
            <div className="flex items-center space-x-4">
              {/* Coming Soon Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Badge 
                  className="bg-green-400/20 text-green-300 border border-green-400/30 font-tt-drugs-condensed uppercase tracking-wide"
                  style={{
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  Week 3 Features
                </Badge>
              </motion.div>

              {/* User Menu */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant="ghost"
                  className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 h-12 w-12 hover:bg-white/20 transition-all duration-300"
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <User className="w-5 h-5 text-white" />
                </Button>
              </motion.div>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 h-12 w-12"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <Menu className="w-5 h-5 text-white" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-6 py-4 space-y-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                  <div className="text-sm font-tt-drugs text-white mb-2">Search</div>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input 
                      placeholder="Start your search"
                      className="bg-transparent text-white placeholder-gray-400 outline-none flex-1 font-tt-drugs"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 pt-20">
        {children}
      </main>

      {/* Airbnb-style Footer */}
      <footer className="relative z-10 mt-20 border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-tt-drugs font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2 font-tt-drugs text-sm text-gray-400">
                <li>How it works</li>
                <li>Constellation Agents</li>
                <li>Housing Analysis</li>
                <li>Fair Housing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-tt-drugs font-semibold text-white mb-4">Community</h3>
              <ul className="space-y-2 font-tt-drugs text-sm text-gray-400">
                <li>Accessibility</li>
                <li>Equity Reports</li>
                <li>Research</li>
                <li>Newsroom</li>
              </ul>
            </div>
            <div>
              <h3 className="font-tt-drugs font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 font-tt-drugs text-sm text-gray-400">
                <li>Help Center</li>
                <li>Safety</li>
                <li>Cancellation</li>
                <li>Disability</li>
              </ul>
            </div>
            <div>
              <h3 className="font-tt-drugs font-semibold text-white mb-4">Cepheus</h3>
              <ul className="space-y-2 font-tt-drugs text-sm text-gray-400">
                <li>About</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Investors</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 text-sm font-tt-drugs text-gray-400">
              <span>© 2024 Cepheus Constellation</span>
              <span>Privacy</span>
              <span>Terms</span>
              <span>Sitemap</span>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm font-tt-drugs text-gray-400">English (US)</span>
              <span className="text-sm font-tt-drugs text-gray-400">USD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}