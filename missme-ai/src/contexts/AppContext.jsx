import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('missme_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (userData) => {
    setUser(userData)
    localStorage.setItem('missme_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setSubscription(null)
    localStorage.removeItem('missme_user')
    localStorage.removeItem('missme_subscription')
  }

  const value = {
    isLoading,
    user,
    subscription,
    login,
    logout,
    setUser,
    setSubscription
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}