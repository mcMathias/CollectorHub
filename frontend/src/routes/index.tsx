import { createBrowserRouter } from 'react-router-dom';

// Layouts and pages will be added as they are built
const router = createBrowserRouter([
  // Public routes
  // {
  //   path: '/login',
  //   element: <LoginPage />,
  // },
  // {
  //   path: '/register',
  //   element: <RegisterPage />,
  // },

  // Protected routes
  // {
  //   path: '/',
  //   element: <AppLayout />,
  //   children: [
  //     { index: true, element: <DashboardPage /> },
  //     { path: 'collections', element: <CollectionsPage /> },
  //     { path: 'collections/:id', element: <CollectionDetailPage /> },
  //     { path: 'items/:id', element: <ItemDetailPage /> },
  //     { path: 'wishlist', element: <WishlistPage /> },
  //     { path: 'settings', element: <SettingsPage /> },
  //   ],
  // },
]);

export default router;
