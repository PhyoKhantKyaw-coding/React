import useAuth from '@/hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const LoginLayout = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()


  if (isAuthenticated) {
    return  <Navigate to={"/"} state={{ from: location }} replace />
  }
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(rgba(0,0,0,0.712)_10%,transparent_1%)] bg-[length:15px_11px] bg-[rgba(151,217,231,0.9)]">
        <Outlet />
    </main>
  )
}

export default LoginLayout