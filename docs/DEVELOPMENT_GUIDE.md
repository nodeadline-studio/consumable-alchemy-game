# Development Guide - Consumable Alchemy

## Overview

This guide provides comprehensive instructions for developing, testing, and deploying the Consumable Alchemy application. It follows best practices for modern web development and AI-assisted development workflows.

## Prerequisites

### Required Software
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended IDE with extensions
- **Chrome/Firefox**: For testing

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

## Project Setup

### 1. Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd consumable-alchemy-game

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://api.consumablealchemy.com
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_AD_NETWORK_ID=your_ad_network_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_id
```

## Development Workflow

### 1. Code Organization

#### File Structure
```
components/
├── ui/                 # Reusable UI components
├── forms/              # Form components
├── layout/             # Layout components
└── features/           # Feature-specific components

lib/
├── api/                # API integrations
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── constants/          # Application constants

types/
├── api.ts              # API-related types
├── game.ts             # Game-related types
└── index.ts            # Main type exports
```

#### Naming Conventions
- **Components**: PascalCase (e.g., `SearchInterface.tsx`)
- **Files**: kebab-case (e.g., `search-interface.tsx`)
- **Variables**: camelCase (e.g., `userProfile`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### 2. Component Development

#### Component Structure
```typescript
// 1. Imports
import React from 'react';
import { motion } from 'framer-motion';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export default function Component({ title, onAction }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState('');
  
  // 5. Event handlers
  const handleClick = () => {
    onAction();
  };
  
  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

#### Best Practices
- Use TypeScript for all components
- Implement proper error boundaries
- Use React.memo for performance optimization
- Follow single responsibility principle
- Write descriptive prop names

### 3. State Management

#### Context Usage
```typescript
// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Custom hook
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// Usage in components
function Component() {
  const { userProfile, updateProfile } = useGame();
  // Component logic
}
```

#### State Patterns
- Use local state for component-specific data
- Use context for global application state
- Use Zustand for complex state management
- Implement proper state normalization

### 4. API Integration

#### API Service Pattern
```typescript
class APIService {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }
}
```

#### Error Handling
```typescript
try {
  const data = await apiService.get('/endpoint');
  setData(data);
} catch (error) {
  console.error('API Error:', error);
  toast.error('Failed to fetch data');
}
```

### 5. Styling Guidelines

#### Tailwind CSS Usage
```typescript
// Use utility classes
<div className="flex items-center space-x-4 p-6 bg-white/10 rounded-xl">

// Use custom classes for complex styles
<div className="glass rounded-xl p-6">

// Use responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

#### Custom CSS
```css
/* Use CSS variables for theming */
:root {
  --primary-color: #0ea5e9;
  --secondary-color: #d946ef;
}

/* Use component-specific styles */
.component {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
}
```

## Testing Strategy

### 1. Unit Testing
```typescript
// Component testing
import { render, screen } from '@testing-library/react';
import Component from './Component';

test('renders component with title', () => {
  render(<Component title="Test Title" />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

### 2. Integration Testing
```typescript
// API integration testing
test('fetches data from API', async () => {
  const mockData = { id: 1, name: 'Test' };
  jest.spyOn(apiService, 'get').mockResolvedValue(mockData);
  
  const result = await apiService.get('/test');
  expect(result).toEqual(mockData);
});
```

### 3. E2E Testing
```typescript
// Playwright E2E tests
test('user can search and add consumables', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="search-input"]', 'apple');
  await page.click('[data-testid="search-button"]');
  await page.click('[data-testid="add-to-lab"]');
  expect(await page.locator('[data-testid="inventory-count"]')).toHaveText('1');
});
```

### 4. Testing Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Performance Optimization

### 1. Code Splitting
```typescript
// Dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

### 2. Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={300}
  height={200}
  priority
/>
```

### 3. Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze
```

### 4. Performance Monitoring
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Security Best Practices

### 1. Input Validation
```typescript
// Validate user inputs
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

const validatedData = schema.parse(userInput);
```

### 2. API Security
```typescript
// Rate limiting
const rateLimit = new Map();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const userLimit = rateLimit.get(ip);
  if (now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}
```

### 3. Data Sanitization
```typescript
// Sanitize user inputs
import DOMPurify from 'dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput);
```

## Deployment

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 2. Environment Variables
```bash
# Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://api.consumablealchemy.com
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### 3. Domain Configuration
```bash
# Add custom domain
vercel domains add consumablealchemy.com
vercel domains add www.consumablealchemy.com
```

## Monitoring and Analytics

### 1. Error Tracking
```typescript
// Sentry integration
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 2. Performance Monitoring
```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 3. User Analytics
```typescript
// Google Analytics
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

## Troubleshooting

### Common Issues

#### 1. Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### 2. TypeScript Errors
```bash
# Check TypeScript
npm run type-check

# Fix auto-fixable issues
npm run lint -- --fix
```

#### 3. Dependency Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Tools
- **React Developer Tools**: Browser extension
- **Redux DevTools**: For state management
- **Network Tab**: For API debugging
- **Console**: For JavaScript errors

## Best Practices Summary

### 1. Code Quality
- Write clean, readable code
- Use TypeScript for type safety
- Follow consistent naming conventions
- Implement proper error handling
- Write comprehensive tests

### 2. Performance
- Optimize images and assets
- Use code splitting
- Implement lazy loading
- Monitor bundle size
- Use performance monitoring

### 3. Security
- Validate all inputs
- Sanitize user data
- Implement rate limiting
- Use HTTPS
- Regular security audits

### 4. User Experience
- Responsive design
- Accessibility compliance
- Fast loading times
- Intuitive navigation
- Error handling

### 5. Maintenance
- Regular dependency updates
- Code documentation
- Version control best practices
- Automated testing
- Monitoring and alerting

## Conclusion

This development guide provides a comprehensive framework for building, testing, and deploying the Consumable Alchemy application. Following these guidelines ensures code quality, performance, and maintainability while providing an excellent user experience.

For questions or clarifications, refer to the project documentation or contact the development team.
