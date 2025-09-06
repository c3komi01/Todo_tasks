import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './screens/App' 
import Authentication, { AuthenticationMode } from './screens/Authentication'
import ProtectedRoute from './components/ProtectedRoute'
import UserProvider from './context/userProvider'
import NotFound from './screens/NotFound'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  { errorElement: <NotFound /> },
  { path: '/signin', element: <Authentication authenticationMode={AuthenticationMode.SignIn} /> },
  { path: '/signup', element: <Authentication authenticationMode={AuthenticationMode.SignUp} /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <App /> }, // список задач — только для вошедших
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
)
