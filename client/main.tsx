import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

//import App from './components/App'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import NewEntry from './components/NewEntry'
import Log from './components/Log'

const queryClient = new QueryClient()

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('app') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
      
      {/* Auth0 */}
      <Auth0Provider
        domain="whai-2025-ben.au.auth0.com"
        clientId="FouvVR0bcnWyb7vzqLXqS3L8bFWvXhvj"
        authorizationParams={{
          redirect_uri: window.location.origin, 
        }}
        // Auth0 - Pop-Up
        useRefreshTokens={true} // Silent Refresh
        cacheLocation="localstorage" // Local for Persistence
      >
      <BrowserRouter>

        {/* routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/newentry" element={<NewEntry />} />
          <Route path="/log" element={<Log />} />
        </Routes>
      </BrowserRouter>
      </Auth0Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>,
  )
})