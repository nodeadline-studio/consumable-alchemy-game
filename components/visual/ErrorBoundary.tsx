'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import AnimatedGraphic from './AnimatedGraphic';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full text-center"
          >
            {/* Error Graphic */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <AnimatedGraphic
                assetId="danger-warning"
                size="large"
                animation="pulse"
                className="mx-auto"
              />
            </motion.div>

            {/* Error Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-white/70 text-lg">
                  The alchemy experiment didn't go as planned. Don't worry, even the best scientists encounter unexpected results!
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.6 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Bug className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-medium text-sm">Development Error Details:</span>
                  </div>
                  <pre className="text-red-300 text-xs overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleRetry}
                  className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleReload}
                  className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Reload Page</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span>Go Home</span>
                </motion.button>
              </div>

              {/* Help Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-white/50 text-sm"
              >
                If this problem persists, please contact our support team.
              </motion.p>
            </motion.div>

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0,
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200
                  }}
                  animate={{ 
                    opacity: [0, 0.3, 0],
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute w-2 h-2 bg-red-400/30 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
