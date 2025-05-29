 import DefaultLayout from '@/layouts/DefaultLayout';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import LoginLayout from '@/layouts/LoginLayout';
import LoginView from '@/modules/auth/LoginView';
import RegisterView from '@/modules/auth/RegisterView';
import RetailHomeView from '@/modules/home/RetailHomeView';
import { persistor, store } from '@/store';
import { Provider } from 'react-redux';
import DashBoardLayout from '@/layouts/DashBoardLayout';
import AdminDashboardPage from '@/modules/admin/AdminHomeView';
import OrdersHistory from '@/modules/home/chunks/OrdersHistory';
import { PersistGate } from 'redux-persist/integration/react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <RetailHomeView /> 
      },
      {
        path: 'orders',
        element: <OrdersHistory /> 
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
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <RouterProvider router={router}></RouterProvider>
          </QueryClientProvider>
          </PersistGate>
       </Provider>
  );
};

export default Wrapper;
