'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useConstellationStore, useAgents, useMetrics } from '@/stores/constellation-store';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  status?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

function MetricCard({ title, value, subtitle, icon, trend, status, className = '' }: MetricCardProps) {
  const getStatusVariant = () => {
    switch (status) {
      case 'success': return 'bg-green-500/10 border-green-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
      case 'info': return 'bg-blue-500/10 border-blue-500/20';
      default: return '';
    }
  };

  const getTrendBadge = () => {
    switch (trend) {
      case 'up': return <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">↗️ +5.2%</Badge>;
      case 'down': return <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">↘️ -2.1%</Badge>;
      case 'stable': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">→ Stable</Badge>;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className={cn("relative overflow-hidden rounded-3xl backdrop-blur-xl border border-white/20 group", className)}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2))',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Animated cosmic background */}
      <div className="absolute inset-0 rounded-3xl opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              style={{
                left: `${20 + i * 20}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <motion.div 
            className="text-3xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{ 
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))',
              color: status === 'success' ? '#22c55e' :
                     status === 'warning' ? '#eab308' :
                     status === 'error' ? '#ef4444' :
                     status === 'info' ? '#3b82f6' : '#00ffff'
            }}
          >
            {icon}
          </motion.div>
          
          <div className="flex items-center space-x-3">
            {status && (
              <motion.div 
                className={cn("w-3 h-3 rounded-full")}
                animate={{
                  boxShadow: [
                    `0 0 10px ${status === 'success' ? 'rgba(34, 197, 94, 0.5)' :
                                status === 'warning' ? 'rgba(234, 179, 8, 0.5)' :
                                status === 'error' ? 'rgba(239, 68, 68, 0.5)' :
                                'rgba(59, 130, 246, 0.5)'}`,
                    `0 0 20px ${status === 'success' ? 'rgba(34, 197, 94, 0.8)' :
                                status === 'warning' ? 'rgba(234, 179, 8, 0.8)' :
                                status === 'error' ? 'rgba(239, 68, 68, 0.8)' :
                                'rgba(59, 130, 246, 0.8)'}`,
                    `0 0 10px ${status === 'success' ? 'rgba(34, 197, 94, 0.5)' :
                                status === 'warning' ? 'rgba(234, 179, 8, 0.5)' :
                                status === 'error' ? 'rgba(239, 68, 68, 0.5)' :
                                'rgba(59, 130, 246, 0.5)'}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  backgroundColor: status === 'success' ? '#22c55e' :
                                  status === 'warning' ? '#eab308' :
                                  status === 'error' ? '#ef4444' :
                                  '#3b82f6'
                }}
              />
            )}
            {getTrendBadge()}
          </div>
        </div>
        
        <div className="space-y-3">
          <motion.h3 
            className="text-sm font-medium uppercase tracking-wider text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h3>
          <motion.div 
            className="text-3xl font-bold text-white"
            style={{ 
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
              filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.3))'
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
          >
            {value}
          </motion.div>
          {subtitle && (
            <motion.p 
              className="text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.1), transparent 70%)',
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  );
}

export default function ConstellationDashboard() {
  const { status, refreshAll, connectionStatus } = useConstellationStore();
  const agents = useAgents();
  const metrics = useMetrics();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (connectionStatus === 'connected') {
      refreshAll();
      setLastRefresh(new Date());
    }
  }, [connectionStatus, refreshAll]);

  const getStatusIcon = (agentStatus: string) => {
    switch (agentStatus) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-cosmic-success" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-cosmic-warning" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-cosmic-error" />;
      default:
        return <Clock className="w-4 h-4 text-cosmic-satellite" />;
    }
  };

  if (connectionStatus !== 'connected') {
    return (
      <div className="airbnb-section">
        <div className="airbnb-container">
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cosmic-asteroid/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-cosmic-star animate-pulse" />
            </div>
            <h2 className="cosmic-h2 mb-4">
              Connecting to Constellation
            </h2>
            <p className="cosmic-body text-cosmic-galaxy">
              Establishing connection to the cosmic housing network...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="airbnb-section">
      <div className="airbnb-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="cosmic-h1 mb-2">
                Constellation Status
              </h1>
              <p className="cosmic-body text-cosmic-galaxy">
                Real-time monitoring of your cosmic housing platform
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Last update: {lastRefresh.toLocaleTimeString()}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  refreshAll();
                  setLastRefresh(new Date());
                }}
                className="bg-background/50 border-border/50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* System Health Banner */}
          {status && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert className={cn(
                "border-2",
                status.system_health.score >= 80 && 'border-green-500/30 bg-green-500/5',
                status.system_health.score >= 60 && status.system_health.score < 80 && 'border-yellow-500/30 bg-yellow-500/5',
                status.system_health.score < 60 && 'border-red-500/30 bg-red-500/5'
              )}>
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {status.system_health.score >= 80 ? '🟢' : status.system_health.score >= 60 ? '🟡' : '🔴'}
                  </div>
                  <div className="flex-1">
                    <AlertDescription className="font-bold text-lg mb-1">
                      System Health: {status.system_health.score}%
                    </AlertDescription>
                    <AlertDescription>
                      {status.system_health.recommendation}
                    </AlertDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {status.constellation_status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </Alert>
            </motion.div>
          )}
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            title="Active Agents"
            value={metrics?.active_agents || 0}
            subtitle={`of ${metrics?.total_agents || 0} total agents`}
            icon={<Users className="w-6 h-6" />}
            status={metrics?.active_agents ? 'success' : 'warning'}
            trend="stable"
          />
          
          <MetricCard
            title="Health Score"
            value={`${metrics?.health_score || 0}%`}
            subtitle="System performance"
            icon={<Activity className="w-6 h-6" />}
            status={
              (metrics?.health_score || 0) >= 80 ? 'success' : 
              (metrics?.health_score || 0) >= 60 ? 'warning' : 'error'
            }
            trend="up"
          />
          
          <MetricCard
            title="Tasks Processed"
            value={metrics?.total_tasks_processed || 0}
            subtitle="Total completed tasks"
            icon={<Zap className="w-6 h-6" />}
            status="info"
            trend="up"
          />
          
          <MetricCard
            title="Response Time"
            value={`${Math.round(metrics?.average_response_time || 0)}ms`}
            subtitle="Average API response"
            icon={<TrendingUp className="w-6 h-6" />}
            status="success"
            trend="stable"
          />
        </div>

        {/* Agents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="cosmic-h2 mb-6">
            Constellation Agents
          </h2>
          
          <div className="airbnb-grid">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.agent_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-background/50 hover:bg-background/70 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Star className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {agent.star_name}
                          </CardTitle>
                          <CardDescription>
                            {agent.agent_type}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusIcon(agent.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={
                        agent.status === 'active' ? 'default' :
                        agent.status === 'degraded' ? 'secondary' :
                        'destructive'
                      }>
                        {agent.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tasks</span>
                      <span className="text-sm font-medium">
                        {agent.current_tasks} active, {agent.queued_tasks} queued
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="text-sm font-medium">
                        {agent.tasks_completed}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Response</span>
                      <span className="text-sm font-medium">
                        {Math.round(agent.average_processing_time)}ms
                      </span>
                    </div>
                    
                    <div className="pt-3 border-t border-border/30">
                      <p className="text-sm text-muted-foreground mb-2">Capabilities</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.map((capability) => (
                          <Badge 
                            key={capability}
                            variant="outline"
                            className="text-xs"
                          >
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {agents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cosmic-asteroid/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-cosmic-star" />
              </div>
              <h3 className="cosmic-h3 mb-2">No Agents Found</h3>
              <p className="cosmic-body text-cosmic-galaxy">
                The constellation is currently empty. Agents will appear here once they register.
              </p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border/50 bg-background/50">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="w-full h-auto py-4 flex-col space-y-2">
                  <span className="text-2xl">🏠</span>
                  <span>Analyze Property</span>
                </Button>
                <Button className="w-full h-auto py-4 flex-col space-y-2" variant="outline">
                  <span className="text-2xl">👥</span>
                  <span>Qualify Homebuyer</span>
                </Button>
                <Button className="w-full h-auto py-4 flex-col space-y-2" variant="outline">
                  <span className="text-2xl">📊</span>
                  <span>Generate Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}