'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkflows, useConstellationStore } from '@/stores/constellation-store';
import { Play, Plus, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const workflowTypes = [
  { 
    id: 'property_analysis', 
    name: 'Property Analysis', 
    icon: '🏠',
    description: 'Comprehensive analysis of property data, compliance, and market conditions'
  },
  { 
    id: 'homebuyer_qualification', 
    name: 'Homebuyer Qualification', 
    icon: '👥',
    description: 'Complete qualification process for potential homebuyers'
  },
  { 
    id: 'market_assessment', 
    name: 'Market Assessment', 
    icon: '📊',
    description: 'Market analysis and trend assessment for specific areas'
  },
  { 
    id: 'compliance_check', 
    name: 'Compliance Check', 
    icon: '🛡️',
    description: 'Fair Housing Act and regulatory compliance verification'
  },
];

export default function WorkflowManager() {
  const workflows = useWorkflows();
  const { createWorkflow, isCreatingWorkflow } = useConstellationStore();
  const [selectedWorkflowType, setSelectedWorkflowType] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-cosmic-success" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-cosmic-error" />;
      case 'running':
        return <Play className="w-4 h-4 text-cosmic-info animate-pulse" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-cosmic-warning" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-cosmic-satellite" />;
    }
  };

  const handleCreateWorkflow = async () => {
    if (!selectedWorkflowType) return;
    
    try {
      await createWorkflow(selectedWorkflowType);
      setSelectedWorkflowType('');
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  return (
    <div className="airbnb-section">
      <div className="airbnb-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="cosmic-h1 mb-2">Workflow Manager</h1>
          <p className="cosmic-body text-cosmic-galaxy">
            Create and monitor housing workflows across the constellation
          </p>
        </motion.div>

        {/* Create Workflow Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cosmic-card mb-8"
        >
          <div className="p-6">
            <h2 className="cosmic-h3 mb-6 flex items-center">
              <Plus className="w-6 h-6 mr-2 icon-glow" />
              Create New Workflow
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {workflowTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedWorkflowType(type.id)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-300 text-left
                    ${selectedWorkflowType === type.id 
                      ? 'border-cosmic-glow bg-cosmic-glow/10 shadow-glow' 
                      : 'border-cosmic-asteroid/30 hover:border-cosmic-glow/50 hover:bg-cosmic-asteroid/10'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <h3 className="cosmic-caption font-bold text-cosmic-white mb-1">
                    {type.name}
                  </h3>
                  <p className="text-xs text-cosmic-galaxy">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateWorkflow}
                disabled={!selectedWorkflowType || isCreatingWorkflow}
                className="cosmic-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingWorkflow ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cosmic-void/30 border-t-cosmic-void rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Create Workflow
                  </>
                )}
              </button>
              
              {selectedWorkflowType && (
                <p className="cosmic-caption text-cosmic-galaxy">
                  Selected: {workflowTypes.find(t => t.id === selectedWorkflowType)?.name}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Workflows List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="cosmic-h2 mb-6">Recent Workflows</h2>
          
          <div className="space-y-4">
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow.workflow_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cosmic-card-hover"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-cosmic-asteroid/20 flex items-center justify-center">
                        <span className="text-lg">
                          {workflowTypes.find(t => t.id === workflow.workflow_type)?.icon || '🔄'}
                        </span>
                      </div>
                      <div>
                        <h3 className="cosmic-h3 text-cosmic-white">
                          {workflow.workflow_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <p className="cosmic-caption text-cosmic-star">
                          {workflow.workflow_id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(workflow.status)}
                      <span className={`
                        cosmic-caption font-medium
                        ${workflow.status === 'completed' ? 'text-cosmic-success' : ''}
                        ${workflow.status === 'failed' ? 'text-cosmic-error' : ''}
                        ${workflow.status === 'running' ? 'text-cosmic-info' : ''}
                        ${workflow.status === 'pending' ? 'text-cosmic-warning' : ''}
                      `}>
                        {workflow.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="cosmic-caption text-cosmic-galaxy">Created</span>
                      <div className="cosmic-caption text-cosmic-white">
                        {new Date(workflow.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="cosmic-caption text-cosmic-galaxy">Progress</span>
                      <div className="cosmic-caption text-cosmic-white">
                        {workflow.completed_steps} / {workflow.total_steps} steps
                      </div>
                    </div>
                    <div>
                      <span className="cosmic-caption text-cosmic-galaxy">Duration</span>
                      <div className="cosmic-caption text-cosmic-white">
                        {workflow.processing_time ? `${workflow.processing_time}s` : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="w-full bg-cosmic-asteroid/30 rounded-full h-2">
                      <div 
                        className="bg-cosmic-glow h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${workflow.total_steps > 0 ? (workflow.completed_steps / workflow.total_steps) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {workflows.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cosmic-asteroid/20 flex items-center justify-center">
                <Play className="w-8 h-8 text-cosmic-star" />
              </div>
              <h3 className="cosmic-h3 mb-2">No Workflows Found</h3>
              <p className="cosmic-body text-cosmic-galaxy">
                Create your first workflow to get started with the constellation.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}