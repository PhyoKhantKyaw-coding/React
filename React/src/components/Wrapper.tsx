 import DefaultLayout from '@/layouts/DefaultLayout';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import LoginLayout from '@/layouts/LoginLayout';
import LoginView from '@/modules/auth/LoginView';
import RegisterView from '@/modules/auth/RegisterView';
import RetailHomeView from '@/modules/home/RetailHomeView';
import { store } from '@/store';
import { Provider } from 'react-redux';
import DashBoardLayout from '@/layouts/DashBoardLayout';
import AdminDashboardPage from '@/modules/admin/AdminHomeView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <RetailHomeView /> 
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
  },
    {
    path: '/admin', 
    element: <DashBoardLayout />,
    children: [
      {
        path: 'home', 
        element: <AdminDashboardPage />
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
       <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <RouterProvider router={router}></RouterProvider>
          </QueryClientProvider>
       </Provider>
  );
};

export default Wrapper;
