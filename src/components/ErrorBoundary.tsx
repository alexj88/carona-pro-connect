import React from "react";

interface State {
  hasError: boolean;
  error: Error | null;
  info: string | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Uncaught error:", error, info);
    this.setState({ error, info: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Ocorreu um erro</h2>
            <p className="mb-4 text-sm text-muted-foreground">Veja os detalhes abaixo e cole-os aqui para que eu possa ajudar.</p>
            <div className="mb-4">
              <strong className="block">Erro:</strong>
              <pre className="whitespace-pre-wrap bg-slate-50 p-3 rounded">{this.state.error?.message}</pre>
            </div>
            <div className="mb-4">
              <strong className="block">Stack / Info do componente:</strong>
              <pre className="whitespace-pre-wrap bg-slate-50 p-3 rounded">{this.state.info}</pre>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-2 rounded bg-primary text-primary-foreground"
                onClick={() => window.location.reload()}
              >
                Recarregar
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
