import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//import App from './components/App'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import NewEntry from './components/NewEntry'

const queryClient = new QueryClient()

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('app') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/newentry" element={<NewEntry/>} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>,
  )
})