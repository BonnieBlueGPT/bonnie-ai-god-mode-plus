import React, { createContext, useContext, useCallback } from 'react'

const AnalyticsContext = createContext()

export function AnalyticsProvider({ children }) {
  const trackEvent = useCallback((eventName, properties = {}) => {
    try {
      // Enhanced properties with MissMe.ai specific data
      const enhancedProperties = {
        ...properties,
        timestamp: Date.now(),
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        session_id: sessionStorage.getItem('missme_session_id') || 'anonymous'
      }

      // Send to analytics service (replace with your analytics provider)
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, enhancedProperties)
      }

      // Send to internal analytics API
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          properties: enhancedProperties
        })
      }).catch(error => console.warn('Analytics tracking failed:', error))

      // Console log for development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Analytics Event:', eventName, enhancedProperties)
      }
    } catch (error) {
      console.warn('Analytics error:', error)
    }
  }, [])

  const trackConversion = useCallback((conversionType, value, metadata = {}) => {
    trackEvent('conversion', {
      conversion_type: conversionType,
      value: value,
      currency: 'USD',
      ...metadata
    })
  }, [trackEvent])

  const trackPageView = useCallback((pageName, additionalData = {}) => {
    trackEvent('page_view', {
      page: pageName,
      ...additionalData
    })
  }, [trackEvent])

  const value = {
    trackEvent,
    trackConversion,
    trackPageView
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}