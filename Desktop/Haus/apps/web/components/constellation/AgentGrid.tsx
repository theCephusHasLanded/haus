'use client';

import { motion } from 'framer-motion';
import { useAgents } from '@/stores/constellation-store';
import { Star, Activity, Zap, Clock } from 'lucide-react';

export default function AgentGrid() {
  const agents = useAgents();

  return (
    <div className="airbnb-section">
      <div className="airbnb-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="cosmic-h1 mb-2">Constellation Agents</h1>
          <p className="cosmic-body text-cosmic-galaxy">
            Manage and monitor your cosmic housing agents
          </p>
        </motion.div>

        <div className="airbnb-grid">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.agent_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="cosmic-card-hover"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-cosmic-glow/20 flex items-center justify-center glow-element">
                    <Star className="w-6 h-6 icon-glow" />
                  </div>
                  <div>
                    <h3 className="cosmic-h3 text-cosmic-white">
                      {agent.star_name}
                    </h3>
                    <p className="cosmic-caption text-cosmic-star">
                      {agent.agent_id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <Activity className="w-5 h-5 mx-auto mb-1 text-cosmic-success" />
                    <div className="cosmic-caption text-cosmic-white font-bold">
                      {agent.tasks_completed}
                    </div>
                    <div className="cosmic-caption text-cosmic-star">
                      Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <Zap className="w-5 h-5 mx-auto mb-1 text-cosmic-warning" />
                    <div className="cosmic-caption text-cosmic-white font-bold">
                      {agent.current_tasks}
                    </div>
                    <div className="cosmic-caption text-cosmic-star">
                      Active
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="cosmic-caption text-cosmic-galaxy">Response Time</span>
                    <span className="cosmic-caption text-cosmic-white">
                      {Math.round(agent.average_processing_time)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="cosmic-caption text-cosmic-galaxy">Uptime</span>
                    <span className="cosmic-caption text-cosmic-white">
                      {Math.round(agent.uptime / 60)}m
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.map((capability) => (
                    <span key={capability} className="cosmic-badge text-xs">
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}