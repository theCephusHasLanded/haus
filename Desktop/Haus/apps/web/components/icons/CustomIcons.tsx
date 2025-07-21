/* Custom Icon System - Futuristic Space Interface */
/* Replacing all emoji with precision-crafted SVG icons */

import React from 'react';

interface IconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'luminous' | 'ambient' | 'whisper' | 'current';
}

const getIconClasses = (size: IconProps['size'], color: IconProps['color'], className?: string) => {
  const sizeClasses = {
    sm: 'icon-sm',
    md: 'icon-md',
    lg: 'icon-lg',
    xl: 'icon-xl'
  };
  
  const colorClasses = {
    luminous: 'icon-luminous',
    ambient: 'icon-ambient',
    whisper: 'icon-whisper',
    current: ''
  };
  
  return `icon ${sizeClasses[size || 'md']} ${colorClasses[color || 'current']} ${className || ''}`.trim();
};

// Navigation Icons
export const HomeIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const SearchIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <circle 
        cx="11" 
        cy="11" 
        r="8" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <path 
        d="M21 21L16.5 16.5" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const FilterIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M4 6H20M7 12H17M10 18H14" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const SettingsIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <circle 
        cx="12" 
        cy="12" 
        r="3" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <path 
        d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.421 10.0723 3.742 9.96512 4.01127 9.77251C4.28054 9.5799 4.48571 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65518 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65518 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const UserIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <circle 
        cx="12" 
        cy="8" 
        r="5" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <path 
        d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  </div>
);

// Data & Analytics Icons
export const ChartIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M3 3V21H21" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M7 16L12 11L16 15L21 10" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="7" cy="16" r="1" fill="currentColor"/>
      <circle cx="12" cy="11" r="1" fill="currentColor"/>
      <circle cx="16" cy="15" r="1" fill="currentColor"/>
      <circle cx="21" cy="10" r="1" fill="currentColor"/>
    </svg>
  </div>
);

export const LocationIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3640 3.63604C20.0518 5.32387 21 7.61305 21 10Z" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <circle 
        cx="12" 
        cy="10" 
        r="3" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
    </svg>
  </div>
);

export const CalendarIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <rect 
        x="3" 
        y="4" 
        width="18" 
        height="18" 
        rx="2" 
        ry="2" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <line 
        x1="16" 
        y1="2" 
        x2="16" 
        y2="6" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <line 
        x1="8" 
        y1="2" 
        x2="8" 
        y2="6" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <line 
        x1="3" 
        y1="10" 
        x2="21" 
        y2="10" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  </div>
);

// Action Icons
export const DownloadIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <polyline 
        points="7,10 12,15 17,10" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <line 
        x1="12" 
        y1="15" 
        x2="12" 
        y2="3" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const UploadIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <polyline 
        points="17,8 12,3 7,8" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <line 
        x1="12" 
        y1="3" 
        x2="12" 
        y2="15" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const CloseIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <line 
        x1="18" 
        y1="6" 
        x2="6" 
        y2="18" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <line 
        x1="6" 
        y1="6" 
        x2="18" 
        y2="18" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const MenuIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <line 
        x1="3" 
        y1="6" 
        x2="21" 
        y2="6" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <line 
        x1="3" 
        y1="12" 
        x2="21" 
        y2="12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <line 
        x1="3" 
        y1="18" 
        x2="21" 
        y2="18" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  </div>
);

// Arrow Icons
export const ArrowRightIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <line 
        x1="5" 
        y1="12" 
        x2="19" 
        y2="12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <polyline 
        points="12,5 19,12 12,19" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <line 
        x1="19" 
        y1="12" 
        x2="5" 
        y2="12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <polyline 
        points="12,5 5,12 12,19" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const ArrowUpIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <line 
        x1="12" 
        y1="19" 
        x2="12" 
        y2="5" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <polyline 
        points="5,12 12,5 19,12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const ArrowDownIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <line 
        x1="12" 
        y1="5" 
        x2="12" 
        y2="19" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <polyline 
        points="5,12 12,19 19,12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// Status Icons
export const CheckIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <polyline 
        points="20,6 9,17 4,12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const PlusIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <line 
        x1="12" 
        y1="5" 
        x2="12" 
        y2="19" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <line 
        x1="5" 
        y1="12" 
        x2="19" 
        y2="12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const MinusIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <line 
        x1="5" 
        y1="12" 
        x2="19" 
        y2="12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  </div>
);

// Constellation-specific Icons
export const StarIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <circle 
        cx="12" 
        cy="12" 
        r="2" 
        fill="currentColor"
      />
      <path 
        d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const ConstellationIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="5" r="1" fill="currentColor"/>
      <circle cx="12" cy="3" r="1" fill="currentColor"/>
      <circle cx="19" cy="7" r="1" fill="currentColor"/>
      <circle cx="3" cy="12" r="1" fill="currentColor"/>
      <circle cx="15" cy="11" r="1" fill="currentColor"/>
      <circle cx="8" cy="16" r="1" fill="currentColor"/>
      <circle cx="18" cy="18" r="1" fill="currentColor"/>
      <path 
        d="M5 5L12 3M12 3L19 7M19 7L15 11M15 11L8 16M8 16L18 18M3 12L8 16" 
        stroke="currentColor" 
        strokeWidth="0.5" 
        opacity="0.6"
      />
    </svg>
  </div>
);

export const PropertyIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M3 21H21M5 21V7L12 3L19 7V21M9 12H15M9 12V17M15 12V17M9 17H15" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const AnalyticsIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="none">
      <rect 
        x="3" 
        y="3" 
        width="18" 
        height="18" 
        rx="2" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <circle cx="8" cy="8" r="1" fill="currentColor"/>
      <circle cx="16" cy="8" r="1" fill="currentColor"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
      <circle cx="8" cy="16" r="1" fill="currentColor"/>
      <circle cx="16" cy="16" r="1" fill="currentColor"/>
      <path 
        d="M8 8L16 8M8 8L12 12M16 8L12 12M12 12L8 16M12 12L16 16" 
        stroke="currentColor" 
        strokeWidth="0.5" 
        opacity="0.4"
      />
    </svg>
  </div>
);

// Dot icon for radio buttons
export const DotIcon: React.FC<IconProps> = ({ size, color, className }) => (
  <div className={getIconClasses(size, color, className)}>
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  </div>
);

// Export all icons
export const Icons = {
  Home: HomeIcon,
  Search: SearchIcon,
  Filter: FilterIcon,
  Settings: SettingsIcon,
  User: UserIcon,
  Chart: ChartIcon,
  Location: LocationIcon,
  Calendar: CalendarIcon,
  Download: DownloadIcon,
  Upload: UploadIcon,
  Close: CloseIcon,
  Menu: MenuIcon,
  ArrowRight: ArrowRightIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowUp: ArrowUpIcon,
  ArrowDown: ArrowDownIcon,
  Check: CheckIcon,
  Plus: PlusIcon,
  Minus: MinusIcon,
  Star: StarIcon,
  Constellation: ConstellationIcon,
  Property: PropertyIcon,
  Analytics: AnalyticsIcon,
  Dot: DotIcon,
};

export default Icons;