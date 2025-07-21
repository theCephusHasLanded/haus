'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Wifi, WifiOff, Settings, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  description: string;
  comingSoon?: boolean;
}

interface ConstellationNavProps {
  items: NavigationItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export default function ConstellationNav({
  items,
  activeTab,
  onTabChange,
  connectionStatus
}: ConstellationNavProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-cosmic-success" />;
      case 'connecting':
        return <Wifi className="w-4 h-4 text-cosmic-warning animate-pulse" />;
      case 'error':
        return <WifiOff className="w-4 h-4 text-cosmic-error" />;
      default:
        return <WifiOff className="w-4 h-4 text-cosmic-satellite" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected to Constellation';
      case 'connecting':
        return 'Connecting to Constellation';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10 shadow-cosmic"
         style={{
           background: 'rgba(0, 0, 0, 0.3)',
           backdropFilter: 'blur(20px)',
           borderImage: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent) 1'
         }}>
      <div className="airbnb-container">
        <div className="flex items-center justify-between h-20 px-6">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="relative star-glow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-cyan-400/20 flex items-center justify-center glow-element border border-white/20">
                <span className="text-3xl animate-twinkle">🌟</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cosmic-glow rounded-full animate-pulse-glow"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-float"></div>
            </div>
            <div>
              <h1 className="cosmic-h3 text-gradient glow-text">
                Cepheus Constellation
              </h1>
              <p className="cosmic-caption text-cosmic-galaxy">
                Housing Platform Command Center
              </p>
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => onTabChange(item.id)}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "relative group px-6 py-3 rounded-2xl transition-all duration-500 overflow-hidden",
                        "backdrop-blur-md border border-white/10",
                        activeTab === item.id 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-glow border-cyan-400/30' 
                          : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20'
                      )}
                      style={activeTab === item.id ? {
                        boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 150, 255, 0.1))'
                      } : {}}
                    >
                      {/* Animated background glow */}
                      {activeTab === item.id && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"
                          animate={{
                            background: [
                              'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 150, 255, 0.1))',
                              'linear-gradient(135deg, rgba(0, 150, 255, 0.1), rgba(128, 0, 255, 0.1))',
                              'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 150, 255, 0.1))'
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                      
                      <div className="relative flex items-center space-x-3">
                        <span className="text-xl filter drop-shadow-glow">{item.icon}</span>
                        <span className="font-medium tracking-wide">{item.label}</span>
                        {item.comingSoon && (
                          <motion.span 
                            className="text-xs px-3 py-1 bg-green-400/20 text-green-300 rounded-full font-bold border border-green-400/30"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{
                              boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
                            }}
                          >
                            SOON
                          </motion.span>
                        )}
                      </div>
                      
                      {/* Elegant active indicator */}
                      {activeTab === item.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent)',
                            boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                          }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 70%)'
                        }}
                      />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="bg-black/90 border-white/20 text-gray-200 backdrop-blur-md"
                    style={{
                      boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <p>{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Elegant Search */}
            <div className="hidden md:block relative">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 z-10" 
                       style={{ filter: 'drop-shadow(0 0 4px rgba(0, 255, 255, 0.5))' }} />
                <input
                  type="text"
                  placeholder="Search constellation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 w-80 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-cyan-400/50 focus:bg-black/50"
                  style={{
                    backdropFilter: 'blur(20px)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 20px rgba(0, 0, 0, 0.2)'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 20px rgba(0, 0, 0, 0.2), 0 0 30px rgba(0, 255, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 20px rgba(0, 0, 0, 0.2)';
                  }}
                />
              </div>
            </div>

            {/* Elegant Connection Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-3 px-5 py-3 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 20px rgba(0, 0, 0, 0.2)'
              }}
            >
              <motion.div 
                className={`w-3 h-3 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400' :
                  connectionStatus === 'connecting' ? 'bg-yellow-400' :
                  connectionStatus === 'error' ? 'bg-red-400' :
                  'bg-gray-400'
                }`}
                animate={connectionStatus === 'connected' ? {
                  boxShadow: [
                    '0 0 10px rgba(34, 197, 94, 0.5)',
                    '0 0 20px rgba(34, 197, 94, 0.8)',
                    '0 0 10px rgba(34, 197, 94, 0.5)'
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  boxShadow: connectionStatus === 'connected' ? '0 0 15px rgba(34, 197, 94, 0.6)' :
                            connectionStatus === 'connecting' ? '0 0 15px rgba(234, 179, 8, 0.6)' :
                            connectionStatus === 'error' ? '0 0 15px rgba(239, 68, 68, 0.6)' :
                            '0 0 10px rgba(107, 114, 128, 0.4)'
                }}
              />
              <div className="text-cyan-400" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 255, 255, 0.5))' }}>
                {getConnectionStatusIcon()}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-200 tracking-wide">
                {getConnectionStatusText()}
              </span>
            </motion.div>

            {/* Elegant Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-4 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300 group"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 20px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Bell className="w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-colors duration-300" 
                       style={{ filter: 'drop-shadow(0 0 2px rgba(0, 255, 255, 0.3))' }} />
                  <motion.div 
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        '0 0 10px rgba(239, 68, 68, 0.5)',
                        '0 0 20px rgba(239, 68, 68, 0.8)',
                        '0 0 10px rgba(239, 68, 68, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent 
                className="bg-black/90 border-white/20 text-gray-200 backdrop-blur-md"
                style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}
              >
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>

            {/* Elegant Settings */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative p-4 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300 group"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 20px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Settings className="w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-colors duration-300" 
                           style={{ filter: 'drop-shadow(0 0 2px rgba(0, 255, 255, 0.3))' }} />
                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent 
                className="bg-black/90 border-white/20 text-gray-200 backdrop-blur-md"
                style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}
              >
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Elegant Mobile Navigation */}
        <div className="lg:hidden border-t border-white/10" 
             style={{ backdropFilter: 'blur(20px)' }}>
          <div className="flex overflow-x-auto py-3 px-4 space-x-3 scrollbar-hide">
            {items.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10",
                  activeTab === item.id 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' 
                    : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
                )}
                style={activeTab === item.id ? {
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)'
                } : {}}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {item.comingSoon && (
                  <span className="text-xs px-2 py-0.5 bg-green-400/20 text-green-300 rounded-full font-bold border border-green-400/30">
                    SOON
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}