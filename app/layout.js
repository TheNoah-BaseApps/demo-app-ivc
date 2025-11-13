'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import '@/app/globals.css';

export default function RootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <html lang="en">
        <body className="bg-gray-50">
          <div className="flex min-h-screen">
            <div className="w-64 bg-gray-800"></div>
            <main className="flex-1"></main>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}