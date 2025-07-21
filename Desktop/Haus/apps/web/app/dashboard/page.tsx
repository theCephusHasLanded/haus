'use client'

import { useAuth } from '@/hooks/useAuth'
import { useProperties } from '@/hooks/useProperties'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { EquityDashboard } from '@/components/equity/EquityDashboard'
import AuthGuard from '@/components/auth/AuthGuard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const { user } = useAuth()
  const { properties, loading } = useProperties()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.user_metadata?.first_name || user?.email}
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{properties.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                ${properties.reduce((sum, prop) => sum + (prop.estimated_value || 0), 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                ${properties.length > 0 
                  ? Math.round(properties.reduce((sum, prop) => sum + (prop.estimated_value || 0), 0) / properties.length).toLocaleString()
                  : '0'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Properties</h2>
          
          {properties.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No properties found. Start by adding your first property!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  onClick={() => {
                    // Handle property click - could navigate to detail page
                    console.log('Property clicked:', property.id)
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Equity Dashboard for first property */}
        {properties.length > 0 && user && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Equity Analysis</h2>
            <EquityDashboard 
              propertyId={properties[0].id} 
              userId={user.id}
            />
          </div>
        )}
      </div>
    </AuthGuard>
  )
}