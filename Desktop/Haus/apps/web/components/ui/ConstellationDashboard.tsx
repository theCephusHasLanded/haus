'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icons from '../icons/CustomIcons';

interface PropertyPoint {
  id: string;
  x: number;
  y: number;
  price: number;
  address: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  marketValue: 'above' | 'at' | 'below';
}

interface ConstellationDashboardProps {
  className?: string;
}

const ConstellationDashboard: React.FC<ConstellationDashboardProps> = ({ className = '' }) => {
  const [selectedProperty, setSelectedProperty] = useState<PropertyPoint | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<PropertyPoint | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 600 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Sample property data - constellation pattern
  const properties: PropertyPoint[] = [
    { id: '1', x: 200, y: 150, price: 450000, address: '123 Main Street', size: 1200, bedrooms: 2, bathrooms: 2, marketValue: 'at' },
    { id: '2', x: 350, y: 120, price: 380000, address: '456 Oak Avenue', size: 1350, bedrooms: 3, bathrooms: 1, marketValue: 'below' },
    { id: '3', x: 500, y: 200, price: 525000, address: '789 Pine Road', size: 1180, bedrooms: 2, bathrooms: 2, marketValue: 'above' },
    { id: '4', x: 280, y: 300, price: 425000, address: '321 Elm Street', size: 1400, bedrooms: 3, bathrooms: 2, marketValue: 'at' },
    { id: '5', x: 600, y: 180, price: 615000, address: '654 Cedar Lane', size: 1800, bedrooms: 4, bathrooms: 3, marketValue: 'above' },
    { id: '6', x: 150, y: 400, price: 325000, address: '987 Birch Way', size: 950, bedrooms: 2, bathrooms: 1, marketValue: 'below' },
    { id: '7', x: 750, y: 250, price: 475000, address: '147 Maple Drive', size: 1300, bedrooms: 3, bathrooms: 2, marketValue: 'at' },
    { id: '8', x: 450, y: 350, price: 395000, address: '258 Willow Court', size: 1100, bedrooms: 2, bathrooms: 2, marketValue: 'below' },
    { id: '9', x: 680, y: 400, price: 550000, address: '369 Spruce Street', size: 1650, bedrooms: 3, bathrooms: 3, marketValue: 'above' },
    { id: '10', x: 100, y: 250, price: 365000, address: '741 Ash Avenue', size: 1050, bedrooms: 2, bathrooms: 1, marketValue: 'below' },
  ];

  // Calculate market stats
  const totalProperties = properties.length;
  const averagePrice = Math.round(properties.reduce((sum, p) => sum + p.price, 0) / totalProperties);
  const priceGrowth = '+12.5%'; // Simulated

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setViewportSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getPropertyRadius = (property: PropertyPoint) => {
    const baseRadius = 3;
    const sizeMultiplier = property.price / 500000; // Scale based on price
    return Math.max(2, Math.min(6, baseRadius * sizeMultiplier));
  };

  const getPropertyOpacity = (property: PropertyPoint) => {
    if (selectedProperty?.id === property.id) return 1;
    if (hoveredProperty?.id === property.id) return 0.9;
    if (selectedProperty || hoveredProperty) return 0.4;
    return 0.7;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConnectionLines = () => {
    if (!selectedProperty) return [];
    
    // Find nearby properties (within 200px radius)
    return properties.filter(p => {
      if (p.id === selectedProperty.id) return false;
      const distance = Math.sqrt(
        Math.pow(p.x - selectedProperty.x, 2) + Math.pow(p.y - selectedProperty.y, 2)
      );
      return distance < 200;
    });
  };

  return (
    <div className={`w-full h-full min-h-[600px] relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-system">
        <div>
          <h1 className="type-galaxy mb-2">Market Overview</h1>
          <div className="flex items-center gap-system type-satellite">
            <span>{totalProperties} Properties</span>
            <span>•</span>
            <span>Avg: {formatPrice(averagePrice)}</span>
            <span>•</span>
            <span className="text-space-luminous">{priceGrowth} Growth</span>
          </div>
        </div>
        
        <div className="flex gap-particle">
          <button className="btn-icon hover-lift">
            <Icons.Filter size="sm" color="ambient" />
          </button>
          <button className="btn-icon hover-lift">
            <Icons.Settings size="sm" color="ambient" />
          </button>
        </div>
      </div>

      {/* Constellation Visualization */}
      <div className="surface card relative overflow-hidden">
        <svg
          ref={svgRef}
          className="w-full h-[600px]"
          viewBox="0 0 900 600"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background grid (subtle) */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(255,255,255,0.02)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connection lines */}
          {getConnectionLines().map((property) => (
            <line
              key={`line-${selectedProperty?.id}-${property.id}`}
              x1={selectedProperty?.x}
              y1={selectedProperty?.y}
              x2={property.x}
              y2={property.y}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="animate-pulse"
            />
          ))}

          {/* Property points */}
          {properties.map((property) => (
            <g key={property.id}>
              {/* Glow effect for selected/hovered */}
              {(selectedProperty?.id === property.id || hoveredProperty?.id === property.id) && (
                <circle
                  cx={property.x}
                  cy={property.y}
                  r={getPropertyRadius(property) + 8}
                  fill="rgba(255,255,255,0.1)"
                  className="animate-pulse"
                />
              )}
              
              {/* Main property dot */}
              <circle
                cx={property.x}
                cy={property.y}
                r={getPropertyRadius(property)}
                fill="rgba(255,255,255,0.9)"
                opacity={getPropertyOpacity(property)}
                className="cursor-pointer transition-all duration-300 hover:fill-white"
                onMouseEnter={() => setHoveredProperty(property)}
                onMouseLeave={() => setHoveredProperty(null)}
                onClick={() => setSelectedProperty(
                  selectedProperty?.id === property.id ? null : property
                )}
              />
            </g>
          ))}

          {/* Property labels for hovered/selected */}
          {(hoveredProperty || selectedProperty) && (
            <g className="fade-in">
              {[hoveredProperty, selectedProperty].filter(Boolean).map((property) => {
                if (!property) return null;
                return (
                  <g key={`label-${property.id}`}>
                    {/* Label background */}
                    <rect
                      x={property.x + 15}
                      y={property.y - 45}
                      width="180"
                      height="60"
                      rx="8"
                      fill="rgba(0,0,0,0.9)"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                    
                    {/* Property info */}
                    <text
                      x={property.x + 25}
                      y={property.y - 25}
                      className="type-satellite"
                      fill="rgba(255,255,255,0.9)"
                      fontSize="12"
                    >
                      {property.address}
                    </text>
                    <text
                      x={property.x + 25}
                      y={property.y - 10}
                      className="type-data"
                      fill="rgba(255,255,255,1)"
                      fontSize="14"
                      fontWeight="500"
                    >
                      {formatPrice(property.price)}
                    </text>
                    <text
                      x={property.x + 25}
                      y={property.y + 5}
                      className="type-particle"
                      fill="rgba(255,255,255,0.7)"
                      fontSize="10"
                    >
                      {property.bedrooms}BR • {property.bathrooms}BA • {property.size.toLocaleString()} sq ft
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 surface-elevated p-element rounded-lg">
          <div className="type-particle mb-2">Market Value</div>
          <div className="flex items-center gap-particle text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white opacity-90"></div>
              <span className="type-satellite">At Market</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
              <span className="type-satellite">Below Market</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <span className="type-satellite">Above Market</span>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Panel */}
      {selectedProperty && (
        <div className="mt-system surface-elevated card fade-in">
          <div className="flex items-start justify-between mb-element">
            <div>
              <h3 className="type-star mb-1">{selectedProperty.address}</h3>
              <div className="type-constellation">{formatPrice(selectedProperty.price)}</div>
            </div>
            <button
              className="btn-icon"
              onClick={() => setSelectedProperty(null)}
            >
              <Icons.Close size="sm" color="ambient" />
            </button>
          </div>

          <div className="grid grid-3 gap-system">
            <div className="surface p-element rounded-lg">
              <div className="type-particle mb-1">SIZE</div>
              <div className="type-data">{selectedProperty.size.toLocaleString()} sq ft</div>
            </div>
            <div className="surface p-element rounded-lg">
              <div className="type-particle mb-1">BEDROOMS</div>
              <div className="type-data">{selectedProperty.bedrooms}</div>
            </div>
            <div className="surface p-element rounded-lg">
              <div className="type-particle mb-1">BATHROOMS</div>
              <div className="type-data">{selectedProperty.bathrooms}</div>
            </div>
          </div>

          <div className="mt-system flex gap-particle">
            <button className="btn-primary">
              <Icons.Analytics size="sm" className="mr-2" />
              Analyze Equity
            </button>
            <button className="btn-ghost">
              <Icons.Location size="sm" className="mr-2" />
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstellationDashboard;