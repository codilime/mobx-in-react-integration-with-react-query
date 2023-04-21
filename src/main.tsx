import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppModule } from '@/app/app-module';

const Main = () => {
  const [router] = useState(() =>
    createBrowserRouter([
      {
        path: '*',
        element: <AppModule />,
      },
    ]),
  );
  return <RouterProvider router={router} />;
};

const rootEl = document.getElementById('root');
rootEl &&
  createRoot(rootEl).render(
    <StrictMode>
      <Main />
    </StrictMode>,
  );
