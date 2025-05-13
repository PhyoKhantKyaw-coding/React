import { Outlet } from 'react-router-dom'

const LoginLayout = () => {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(rgba(0,0,0,0.712)_10%,transparent_1%)] bg-[length:15px_11px] bg-[rgba(151,217,231,0.9)]">
    
        <Outlet />
    </main>
  )
}

export default LoginLayout