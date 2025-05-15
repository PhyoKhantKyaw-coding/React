 import DefaultLayout from '@/layouts/DefaultLayout';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import LoginLayout from '@/layouts/LoginLayout';
import LoginView from '@/modules/Auth/LoginView';
import RegisterView from '@/modules/Auth/RegisterView';
import RetailHomeView from '@/modules/home/RetailHomeView';
//import AdminDashboardLayout from '@/layouts/DashBoardLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <RetailHomeView /> // Home page, e.g. /home
      }
    ]
  },
  {
    path: '/auth', 
    element: <LoginLayout />,
    children: [
      {
        path: 'login', 
        element: <LoginView />
      },
      {
        path: 'register', 
        element: <RegisterView />
      }
    ]
  }
]);

const Wrapper = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </>
  );
};

export default Wrapper;
