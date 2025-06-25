import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import Button from '../ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      error: null,
      errorInfo: null,
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You can add your error logging service here:
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      error: null,
      errorInfo: null,
      hasError: false
    });
    // Optional: Add any reset logic for your app
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">
              <FaExclamationTriangle size={48} color="#f44336" />
            </div>
            <h2>Something went wrong</h2>
            
            {this.props.customMessage || (
              <p>We're sorry - an unexpected error occurred.</p>
            )}

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error details</summary>
                <p>{this.state.error?.toString()}</p>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}

            <div className="error-actions">
              <Button 
                variant="primary"
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button 
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;