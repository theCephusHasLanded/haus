'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@/types/database.types'

type Property = Database['public']['Tables']['properties']['Row']

interface PropertyCardProps {
  property: Property
  onClick?: () => void
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const formatPrice = (price: number | null) => {
    if (!price) return 'Price not available'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-gray-100 text-gray-800'
      case 'off_market': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {property.address_line1}
            </CardTitle>
            <CardDescription>
              {property.city}, {property.state} {property.zip_code}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(property.property_status)}>
            {property.property_status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(property.listing_price)}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Beds:</span>
              <span className="ml-1 font-semibold">{property.bedrooms || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Baths:</span>
              <span className="ml-1 font-semibold">{property.bathrooms || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Sqft:</span>
              <span className="ml-1 font-semibold">
                {property.square_footage?.toLocaleString() || 'N/A'}
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <span className="capitalize">
              {property.property_type.replace('_', ' ')}
            </span>
            {property.year_built && (
              <span className="ml-2">• Built {property.year_built}</span>
            )}
          </div>

          {property.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {property.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}