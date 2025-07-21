'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface EquityDashboardProps {
  propertyId: string
  userId: string
}

export function EquityDashboard({ propertyId, userId }: EquityDashboardProps) {
  const [equityData, setEquityData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const calculateEquity = async () => {
    try {
      setLoading(true)
      
      // Call the edge function for equity calculation
      const { data, error } = await supabase.functions.invoke('equity-calculator', {
        body: {
          propertyId,
          userId,
          includeProjections: true
        }
      })

      if (error) throw error
      setEquityData(data)
    } catch (error) {
      console.error('Error calculating equity:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    calculateEquity()
  }, [propertyId, userId])

  if (loading) {
    return <div className="animate-pulse">Loading equity data...</div>
  }

  if (!equityData) {
    return <div>Failed to load equity data</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Equity</CardTitle>
            <CardDescription>Your ownership value</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ${equityData.equity.current_equity.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              {equityData.equity.equity_percentage.toFixed(1)}% of property value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Value</CardTitle>
            <CardDescription>Current estimated value</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              ${equityData.equity.market_value.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outstanding Debt</CardTitle>
            <CardDescription>Total loans and mortgages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              ${equityData.equity.total_debt.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {equityData.projections && (
        <Card>
          <CardHeader>
            <CardTitle>Equity Projections</CardTitle>
            <CardDescription>5-year equity forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {equityData.projections.slice(0, 5).map((projection: any) => (
                <div key={projection.month} className="flex justify-between">
                  <span>Year {Math.ceil(projection.month / 12)}</span>
                  <span className="font-semibold">
                    ${projection.projected_equity.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({projection.projected_equity_percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}