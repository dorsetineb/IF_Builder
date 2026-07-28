import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in Component:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-xl text-red-300 flex flex-col items-center justify-center text-center gap-4 my-auto h-full min-h-[300px]">
          <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 text-xl font-bold">
            ⚠️
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-200 mb-1">
              {this.props.fallbackTitle || 'Ocorreu um erro ao carregar este painel'}
            </h3>
            <p className="text-xs text-red-400 max-w-md font-mono bg-background/50 p-2.5 rounded border border-red-500/20 break-words text-left overflow-auto max-h-40">
              {this.state.error?.message || 'Erro desconhecido'}
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
