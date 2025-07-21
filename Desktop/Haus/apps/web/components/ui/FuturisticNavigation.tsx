'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icons from '../icons/CustomIcons';

interface NavigationProps {
  className?: string;
}

const FuturisticNavigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().split('T')[0]); // YYYY-MM-DD format
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    {
      label: 'Properties',
      href: '/properties',
      icon: Icons.Property,
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: Icons.Analytics,
    },
    {
      label: 'Equity Tools',
      href: '/equity-analysis',
      icon: Icons.Chart,
    },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <nav className={`nav-primary ${className}`}>
      <div className="flex items-center">
        {/* Brand */}
        <Link href="/" className="nav-brand">
          HAUS
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex nav-links">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
            >
              <IconComponent size="sm" color="current" className="mr-2" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button className="btn-icon hover-lift">
          <Icons.Search size="sm" color="ambient" />
        </button>

        {/* Time Display */}
        <div className="hidden sm:block type-particle">
          {currentTime}
        </div>

        {/* User Profile */}
        <button className="btn-icon hover-lift">
          <Icons.User size="sm" color="ambient" />
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden btn-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <Icons.Close size="sm" color="ambient" />
          ) : (
            <Icons.Menu size="sm" color="ambient" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-sm surface-elevated slide-in">
            <div className="p-system">
              {/* Header */}
              <div className="flex items-center justify-between mb-galaxy">
                <div className="type-star">Navigation</div>
                <button
                  className="btn-icon"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <Icons.Close size="sm" color="ambient" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center w-full p-element rounded-lg transition-all duration-300 ${
                        isActive(item.href)
                          ? 'bg-space-whisper text-space-pure'
                          : 'text-space-soft hover:bg-space-ambient hover:text-space-luminous'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconComponent size="sm" color="current" className="mr-3" />
                      <span className="type-orbit">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="my-galaxy h-px bg-space-whisper opacity-30" />

              {/* User Section */}
              <div className="flex items-center p-element">
                <Icons.User size="md" color="ambient" className="mr-3" />
                <div>
                  <div className="type-orbit">Profile</div>
                  <div className="type-particle">Settings & Account</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default FuturisticNavigation;