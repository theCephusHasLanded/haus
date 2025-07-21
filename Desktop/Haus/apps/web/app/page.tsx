'use client';

import React from 'react';
import FuturisticNavigation from '@/components/ui/FuturisticNavigation';
import ConstellationDashboard from '@/components/ui/ConstellationDashboard';
import Icons from '@/components/icons/CustomIcons';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <FuturisticNavigation />

      {/* Main Content */}
      <main className="container p-constellation">
        {/* Hero Section */}
        <section className="text-center mb-universe fade-in">
          <h1 className="type-cosmos mb-system">
            Housing Equity
            <br />
            <span className="type-galaxy">Analysis Platform</span>
          </h1>
          <p className="type-orbit max-w-2xl mx-auto mb-galaxy">
            Advanced constellation-based data visualization for housing market analysis.
            Discover equity opportunities through precision analytics and AR-style interfaces.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-particle justify-center items-center">
            <button className="btn-primary hover-lift">
              <Icons.Analytics size="sm" className="mr-2" />
              Explore Properties
            </button>
            <button className="btn-ghost hover-lift">
              <Icons.Chart size="sm" className="mr-2" />
              View Analytics
            </button>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-auto gap-system mb-galaxy">
          <div className="card surface-elevated hover-lift glow-pulse">
            <div className="flex items-center justify-between mb-element">
              <Icons.Property size="lg" color="luminous" />
              <div className="type-constellation">1,247</div>
            </div>
            <div className="type-satellite mb-particle">Active Properties</div>
            <div className="type-particle text-space-luminous">+156 this month</div>
          </div>

          <div className="card surface-elevated hover-lift glow-pulse">
            <div className="flex items-center justify-between mb-element">
              <Icons.Chart size="lg" color="luminous" />
              <div className="type-constellation">$450K</div>
            </div>
            <div className="type-satellite mb-particle">Average Value</div>
            <div className="type-particle text-space-luminous">+12.5% growth</div>
          </div>

          <div className="card surface-elevated hover-lift glow-pulse">
            <div className="flex items-center justify-between mb-element">
              <Icons.Analytics size="lg" color="luminous" />
              <div className="type-constellation">94.2%</div>
            </div>
            <div className="type-satellite mb-particle">Data Accuracy</div>
            <div className="type-particle text-space-luminous">Real-time sync</div>
          </div>

          <div className="card surface-elevated hover-lift glow-pulse">
            <div className="flex items-center justify-between mb-element">
              <Icons.Location size="lg" color="luminous" />
              <div className="type-constellation">28</div>
            </div>
            <div className="type-satellite mb-particle">Avg Days Market</div>
            <div className="type-particle text-space-luminous">-12% vs last month</div>
          </div>
        </section>

        {/* Main Dashboard */}
        <section className="mb-galaxy">
          <ConstellationDashboard />
        </section>

        {/* Feature Grid */}
        <section className="mb-galaxy">
          <h2 className="type-constellation text-center mb-galaxy">Platform Features</h2>
          
          <div className="grid grid-3 gap-system">
            <div className="card surface hover-lift">
              <div className="mb-system">
                <Icons.Constellation size="xl" color="luminous" />
              </div>
              <h3 className="type-star mb-element">Constellation Mapping</h3>
              <p className="type-orbit mb-system">
                Visualize property relationships through astronomical data patterns.
                Discover market correlations using AR-style constellation interfaces.
              </p>
              <button className="btn-ghost w-full">
                <Icons.ArrowRight size="sm" className="mr-2" />
                Learn More
              </button>
            </div>

            <div className="card surface hover-lift">
              <div className="mb-system">
                <Icons.Analytics size="xl" color="luminous" />
              </div>
              <h3 className="type-star mb-element">Equity Analysis</h3>
              <p className="type-orbit mb-system">
                Advanced algorithms calculate housing equity potential with
                precision accuracy. AI-powered market predictions and trends.
              </p>
              <button className="btn-ghost w-full">
                <Icons.ArrowRight size="sm" className="mr-2" />
                Analyze Now
              </button>
            </div>

            <div className="card surface hover-lift">
              <div className="mb-system">
                <Icons.Chart size="xl" color="luminous" />
              </div>
              <h3 className="type-star mb-element">Market Intelligence</h3>
              <p className="type-orbit mb-system">
                Real-time market data with predictive analytics. Track neighborhood
                trends and investment opportunities with surgical precision.
              </p>
              <button className="btn-ghost w-full">
                <Icons.ArrowRight size="sm" className="mr-2" />
                View Reports
              </button>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="text-center mb-galaxy">
          <h2 className="type-constellation mb-galaxy">Built for the Future</h2>
          
          <div className="grid grid-2 gap-galaxy items-center">
            <div className="text-left">
              <h3 className="type-star mb-system">Precision Typography</h3>
              <p className="type-orbit mb-system">
                Designed with TT Drugs font family for maximum legibility and
                technical precision. Every weight carefully calibrated for
                optimal data presentation.
              </p>
              
              <h3 className="type-star mb-system">Ambient Interface</h3>
              <p className="type-orbit mb-system">
                Soft white luminescence creates an ethereal, space-like experience.
                Minimalist design philosophy with graceful micro-interactions
                and fluid animations.
              </p>

              <h3 className="type-star mb-system">Performance Optimized</h3>
              <p className="type-orbit">
                Built for speed with efficient rendering and smooth 60fps animations.
                Responsive design that scales beautifully across all device sizes.
              </p>
            </div>

            <div className="surface-luminous card text-center">
              <Icons.Star size="xl" color="current" className="mb-system mx-auto" />
              <div className="type-star mb-element">Enterprise Ready</div>
              <div className="type-orbit mb-system">
                Scalable architecture designed for institutional use.
                SOC 2 compliant with enterprise-grade security.
              </div>
              <button className="btn-primary">
                <Icons.Settings size="sm" className="mr-2" />
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-space-whisper mt-universe">
        <div className="container p-constellation">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="type-satellite mb-system md:mb-0">
              © 2024 Haus Platform. Built with precision and care.
            </div>
            
            <div className="flex gap-system">
              <button className="btn-icon">
                <Icons.Analytics size="sm" color="whisper" />
              </button>
              <button className="btn-icon">
                <Icons.Settings size="sm" color="whisper" />
              </button>
              <button className="btn-icon">
                <Icons.User size="sm" color="whisper" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}