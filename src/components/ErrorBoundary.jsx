import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Something broke while rendering the page:', error, info)
  }

  handleReload = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 'calc(var(--nav-h) + 3rem) var(--px) 4rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '1rem' }}>Something went wrong loading this page</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            This is usually caused by a product having unexpected data (like a category or image field set up differently than expected). Check the browser console for details.
          </p>
          <button onClick={this.handleReload} className="btn-primary">
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
