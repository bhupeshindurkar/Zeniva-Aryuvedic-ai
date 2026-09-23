import React from 'react';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';
import { ZenivaLogo } from './ZenivaIcons';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Zeniva App ErrorBoundary caught an unhandled render error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    try {
      window.location.reload();
    } catch (e) {
      window.location.href = '/';
    }
  };

  handleGoHome = () => {
    try {
      window.location.hash = 'overview/home';
      window.location.reload();
    } catch (e) {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex items-center justify-center p-4 font-sans select-none">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#EBE3D5] shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#1C1030] flex items-center justify-center mx-auto shadow-md">
              <ZenivaLogo className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Interface Notice</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Zeniva Clinical Session Recovery
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                An unexpected view state occurred during screen transition. Your clinical records and registration data are safe.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-left font-mono text-[11px] text-stone-600 max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3.5 rounded-2xl bg-[#5B3E8C] hover:bg-[#4A3273] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page & Resume</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Zeniva Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
