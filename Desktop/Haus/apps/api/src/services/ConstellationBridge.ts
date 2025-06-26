/**
 * Constellation Bridge - tRPC side integration
 * Connects existing Haus tRPC services with Cepheus Constellation agents
 */

import { z } from 'zod';

interface ConstellationResponse {
  success: boolean;
  result?: any;
  error?: string;
  agent_processed: boolean;
  constellation_id?: string;
}

interface AgentRequest {
  type: string;
  data: any;
  priority?: number;
  requires_mpc?: boolean;
}

export class ConstellationBridge {
  private constellationApiUrl: string;
  
  constructor() {
    this.constellationApiUrl = process.env.CEPHEUS_API_URL || 'http://localhost:8000';
  }

  /**
   * Delegate equity analysis to constellation agents with MPC enhancement
   */
  async delegateEquityAnalysis(equityRequest: any): Promise<ConstellationResponse> {
    try {
      const agentRequest: AgentRequest = {
        type: 'equity_analysis_enhanced',
        data: equityRequest,
        requires_mpc: true,
        priority: 8
      };

      const response = await fetch(`${this.constellationApiUrl}/constellation/bridge/haus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source': 'haus-trpc'
        },
        body: JSON.stringify(agentRequest)
      });

      if (!response.ok) {
        throw new Error(`Constellation request failed: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('📊 Equity analysis delegated to constellation', {
        request: equityRequest,
        constellation_id: result.constellation_id
      });

      return result;

    } catch (error) {
      console.error('❌ Constellation equity delegation failed:', error);
      throw error;
    }
  }

  /**
   * Delegate property valuation to constellation with privacy-preserving computation
   */
  async delegatePropertyValuation(propertyData: any): Promise<ConstellationResponse> {
    try {
      const agentRequest: AgentRequest = {
        type: 'property_valuation_mpc',
        data: propertyData,
        requires_mpc: true,
        priority: 7
      };

      const response = await fetch(`${this.constellationApiUrl}/constellation/bridge/haus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source': 'haus-trpc'
        },
        body: JSON.stringify(agentRequest)
      });

      const result = await response.json();
      
      console.log('🏠 Property valuation delegated to constellation', {
        property_id: propertyData.id,
        constellation_id: result.constellation_id
      });

      return result;

    } catch (error) {
      console.error('❌ Constellation property valuation failed:', error);
      throw error;
    }
  }

  /**
   * Request housing application processing through constellation
   */
  async delegateHousingApplication(applicationData: any): Promise<ConstellationResponse> {
    try {
      const agentRequest: AgentRequest = {
        type: 'housing_application_workflow',
        data: applicationData,
        priority: 9, // High priority for applications
        requires_mpc: false
      };

      const response = await fetch(`${this.constellationApiUrl}/constellation/bridge/haus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source': 'haus-trpc'
        },
        body: JSON.stringify(agentRequest)
      });

      const result = await response.json();
      
      console.log('📝 Housing application delegated to constellation', {
        applicant_id: applicationData.applicant_id,
        constellation_id: result.constellation_id
      });

      return result;

    } catch (error) {
      console.error('❌ Constellation housing application failed:', error);
      throw error;
    }
  }

  /**
   * Get constellation status and agent health
   */
  async getConstellationStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.constellationApiUrl}/constellation/status`, {
        method: 'GET',
        headers: {
          'X-Source': 'haus-trpc'
        }
      });

      if (!response.ok) {
        throw new Error(`Status request failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Failed to get constellation status:', error);
      throw error;
    }
  }

  /**
   * Enhanced equity calculation that combines traditional Haus logic with constellation MPC
   */
  async enhancedEquityCalculation(propertyData: any, userPreferences: any): Promise<any> {
    try {
      // First, run traditional Haus equity calculation
      const traditionalResult = await this.calculateTraditionalEquity(propertyData);
      
      // Then, enhance with constellation MPC computation
      const mpcRequest = {
        property_data: propertyData,
        user_preferences: userPreferences,
        traditional_result: traditionalResult,
        privacy_requirements: {
          hide_individual_valuations: true,
          aggregate_only: true,
          confidence_threshold: 0.8
        }
      };

      const constellationResult = await this.delegateEquityAnalysis(mpcRequest);

      if (constellationResult.success) {
        return {
          ...traditionalResult,
          mpc_enhanced: true,
          privacy_preserving_metrics: constellationResult.result.privacy_preserving_metrics,
          confidence_score: constellationResult.result.confidence_score,
          constellation_verified: true,
          enhanced_at: new Date().toISOString()
        };
      } else {
        // Fallback to traditional calculation if constellation fails
        console.warn('🔄 Constellation enhancement failed, using traditional calculation');
        return {
          ...traditionalResult,
          mpc_enhanced: false,
          fallback_reason: constellationResult.error
        };
      }

    } catch (error) {
      console.error('❌ Enhanced equity calculation failed:', error);
      throw error;
    }
  }

  /**
   * Traditional equity calculation (existing Haus logic)
   * This preserves your existing calculations while adding constellation enhancement
   */
  private async calculateTraditionalEquity(propertyData: any): Promise<any> {
    // This would call your existing EquityService.ts logic
    // For now, returning a placeholder structure
    return {
      property_id: propertyData.id,
      estimated_value: propertyData.estimated_value,
      equity_score: 0.75, // Placeholder
      market_factors: {
        location_score: 0.8,
        property_condition: 0.7,
        market_trends: 0.6
      },
      traditional_calculation: true,
      calculated_at: new Date().toISOString()
    };
  }

  /**
   * Health check for constellation connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.constellationApiUrl}/health`, {
        method: 'GET',
        timeout: 5000 // 5 second timeout
      });

      return response.ok;

    } catch (error) {
      console.error('❌ Constellation health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const constellationBridge = new ConstellationBridge();