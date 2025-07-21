'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Activity } from 'lucide-react';
import { useMetrics, useConnectionStatus } from '@/stores/constellation-store';

export default function SystemMetrics() {
  const [isExpanded, setIsExpanded] = useState(false);
  const metrics = useMetrics();
  const connectionStatus = useConnectionStatus();

  if (connectionStatus !== 'connected') {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <motion.div
        layout
        className="cosmic-card bg-cosmic-space/95 backdrop-blur-md border border-cosmic-asteroid/30 min-w-64"
      >
        {/* Header */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-cosmic-asteroid/10 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cosmic-glow animate-pulse" />
            <span className="cosmic-caption font-medium text-cosmic-white">
              System Metrics
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-cosmic-galaxy" />
          ) : (
            <ChevronUp className="w-4 h-4 text-cosmic-galaxy" />
          )}
        </motion.button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3 border-t border-cosmic-asteroid/30">
                <div className="flex justify-between">
                  <span className="cosmic-caption text-cosmic-galaxy">Health Score</span>
                  <span className={`
                    cosmic-caption font-medium
                    ${(metrics?.health_score || 0) >= 80 ? 'text-cosmic-success' : ''}
                    ${(metrics?.health_score || 0) >= 60 && (metrics?.health_score || 0) < 80 ? 'text-cosmic-warning' : ''}
                    ${(metrics?.health_score || 0) < 60 ? 'text-cosmic-error' : ''}
                  `}>
                    {metrics?.health_score || 0}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="cosmic-caption text-cosmic-galaxy">Active Agents</span>
                  <span className="cosmic-caption text-cosmic-white">
                    {metrics?.active_agents || 0}/{metrics?.total_agents || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="cosmic-caption text-cosmic-galaxy">Success Rate</span>
                  <span className="cosmic-caption text-cosmic-success">
                    {Math.round((metrics?.overall_success_rate || 0) * 100)}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="cosmic-caption text-cosmic-galaxy">Avg Response</span>
                  <span className="cosmic-caption text-cosmic-white">
                    {Math.round(metrics?.average_response_time || 0)}ms
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="cosmic-caption text-cosmic-galaxy">Tasks Processed</span>
                  <span className="cosmic-caption text-cosmic-white">
                    {metrics?.total_tasks_processed || 0}
                  </span>
                </div>

                {/* Health Status Bar */}
                <div className="pt-2">
                  <div className="w-full bg-cosmic-asteroid/30 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics?.health_score || 0}%` }}
                      className={`
                        h-2 rounded-full transition-all duration-1000
                        ${(metrics?.health_score || 0) >= 80 ? 'bg-cosmic-success' : ''}
                        ${(metrics?.health_score || 0) >= 60 && (metrics?.health_score || 0) < 80 ? 'bg-cosmic-warning' : ''}
                        ${(metrics?.health_score || 0) < 60 ? 'bg-cosmic-error' : ''}
                      `}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}