import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router'
import { TaskBoard } from './TaskBoard.jsx'
import './index.css'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
  path: '/',
  element: <App/>,
  children: [
    {
    path: ':boardId',
    element: <TaskBoard/>
  }
]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}>
    </RouterProvider>
    </QueryClientProvider>
  </StrictMode>,
)