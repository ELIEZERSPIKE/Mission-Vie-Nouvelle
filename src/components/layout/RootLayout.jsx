import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ScrollToAnchor from '../ScrollToAnchor';

export default function RootLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <ScrollToAnchor />
      <Outlet />
    </>
  );
}