import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Phone, ChevronDown, ChevronUp, Copy, Check, ShieldAlert } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  resetKey?: string | number;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log component crash details to console and error telemetry
    console.error(' [ErrorBoundary] Uncaught component error:', error);
    console.error(' [ErrorBoundary] Component stack trace:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });

    // Optional: send error to telemetry or analytics if available
    try {
      if (typeof window !== 'undefined' && (window as any).reportPortalError) {
        (window as any).reportPortalError({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          path: window.location.pathname,
          time: new Date().toISOString(),
        });
      }
    } catch {
      // Ignore telemetry errors
    }
  }

  public componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Auto-reset error boundary if resetKey (like route path) changed
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.handleReset();
    }
  }

  public handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public handleReload = (): void => {
    window.location.reload();
  };

  public handleGoHome = (): void => {
    window.location.href = '/';
  };

  public handleCopyError = (): void => {
    const { error, errorInfo } = this.state;
    const errorText = [
      `URL: ${window.location.href}`,
      `Time: ${new Date().toISOString()}`,
      `Error: ${error?.name || 'Error'}: ${error?.message || 'Unknown error'}`,
      `Stack:\n${error?.stack || 'No stack'}`,
      `Component Stack:\n${errorInfo?.componentStack || 'No component stack'}`,
    ].join('\n\n');

    navigator.clipboard.writeText(errorText).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    });
  };

  public toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || 'An unexpected rendering error occurred.';
      const componentStack = this.state.errorInfo?.componentStack;

      return (
        <div
          id="error-boundary-container"
          className="min-h-[60vh] flex items-center justify-center p-4 sm:p-8"
        >
          <div
            id="error-boundary-card"
            className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-red-200 overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-slate-800/20 rounded-xl backdrop-blur-sm flex-shrink-0">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-block px-2.5 py-0.5 bg-black/30 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-200 mb-1">
                  View Recovery Safeguard
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Something Went Wrong
                </h2>
                <p className="text-red-100 text-sm mt-1 leading-relaxed">
                  The page encountered an unexpected issue while rendering. Don&apos;t worry, your data and the rest of the portal are safe.
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Message Box */}
              <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl">
                <div className="flex items-center gap-2 text-red-900 font-semibold text-sm mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>Error Summary</span>
                </div>
                <p className="text-xs sm:text-sm text-red-800 font-mono break-words">
                  {errorMessage}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  id="error-boundary-retry-btn"
                  onClick={this.handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0B2545] hover:bg-blue-900 text-white font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow active:scale-[0.98]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>

                <button
                  id="error-boundary-reload-btn"
                  onClick={this.handleReload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow active:scale-[0.98]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reload Page</span>
                </button>

                <button
                  id="error-boundary-home-btn"
                  onClick={this.handleGoHome}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 text-slate-800 dark:text-slate-100 font-bold rounded-xl text-sm transition-all border border-slate-300 dark:border-slate-600 active:scale-[0.98]"
                >
                  <Home className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span>Go to Home</span>
                </button>
              </div>

              {/* Help & Support Info */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Need urgent help with form filling or admit cards?</span>
                </div>
                <a
                  href="tel:+919956078419"
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  Call +91 99560 78419
                </a>
              </div>

              {/* Collapsible Technical Details for Debugging */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <button
                  id="error-boundary-toggle-details-btn"
                  onClick={this.toggleDetails}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:bg-slate-800/50 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors text-left"
                >
                  <span>Technical Diagnostics & Stack Trace</span>
                  {this.state.showDetails ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  )}
                </button>

                {this.state.showDetails && (
                  <div className="p-4 bg-slate-900 text-slate-200 text-xs font-mono space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Crash Log</span>
                      <button
                        id="error-boundary-copy-btn"
                        onClick={this.handleCopyError}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                      >
                        {this.state.copied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>Copy Diagnostic Info</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2 select-all">
                      <div>
                        <div className="text-red-400 font-bold mb-1">
                          {this.state.error?.name}: {this.state.error?.message}
                        </div>
                        {this.state.error?.stack && (
                          <pre className="text-[11px] text-slate-400 whitespace-pre-wrap font-mono leading-relaxed">
                            {this.state.error.stack}
                          </pre>
                        )}
                      </div>

                      {componentStack && (
                        <div className="pt-2 border-t border-slate-800">
                          <div className="text-amber-400 font-bold mb-1">Component Hierarchy:</div>
                          <pre className="text-[10px] text-slate-400 whitespace-pre-wrap font-mono leading-relaxed">
                            {componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
