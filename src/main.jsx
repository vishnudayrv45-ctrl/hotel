import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import './styles.css'

class Boundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <pre style={{ color: '#ff9d7a', background: '#120d09', padding: 24, whiteSpace: 'pre-wrap', minHeight: '100vh', margin: 0 }}>
          {String(this.state.error.stack || this.state.error)}
        </pre>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <Boundary>
    <StoreProvider>
      <App />
    </StoreProvider>
  </Boundary>
)