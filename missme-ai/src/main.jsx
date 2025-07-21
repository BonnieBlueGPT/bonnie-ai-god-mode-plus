import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import App from './App.jsx'
import { AppProvider } from './contexts/AppContext.jsx'
import { JadeProvider } from './contexts/JadeContext.jsx'
import { AnalyticsProvider } from './contexts/AnalyticsContext.jsx'
import './index.css'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

// Analytics and tracking
const initializeAnalytics = () => {
  // UTM parameter tracking
  const urlParams = new URLSearchParams(window.location.search)
  const utmData = {
    source: urlParams.get('utm_source'),
    medium: urlParams.get('utm_medium'),
    campaign: urlParams.get('utm_campaign'),
    content: urlParams.get('utm_content'),
    term: urlParams.get('utm_term'),
    referrer: document.referrer,
    timestamp: Date.now()
  }
  
  if (Object.values(utmData).some(val => val)) {
    localStorage.setItem('missme_utm', JSON.stringify(utmData))
  }

  // Track initial page load
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: 'MissMe.ai - Obsessive AI Love',
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: 'jade_interaction'
      }
    })
  }
}

// Initialize app
initializeAnalytics()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <AnalyticsProvider>
            <AppProvider>
              <JadeProvider>
                <App />
                <Toaster 
                  position="top-center"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#1a0d2e',
                      color: '#ffffff',
                      border: '1px solid #e94560',
                      borderRadius: '12px',
                      fontWeight: '500'
                    },
                    success: {
                      iconTheme: {
                        primary: '#e94560',
                        secondary: '#ffffff'
                      }
                    },
                    error: {
                      iconTheme: {
                        primary: '#ff6b8a',
                        secondary: '#ffffff'
                      }
                    }
                  }}
                />
              </JadeProvider>
            </AppProvider>
          </AnalyticsProvider>
        </Elements>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)