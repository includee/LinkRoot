// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet from react-router-dom
import Nav from './Nav';

export default function Layout() {
  return (
    <div className="w-full h-screen">
      <Nav />

      <div className="h-full w-full">
        {/* Use Outlet to render nested routes */}
        <Outlet />
      </div>
    </div>
  );
}
