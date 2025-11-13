'use client';

import React, { useState, useEffect } from 'react';
import { Home, Package, TrendingUp, ShoppingCart, ShoppingBag, BarChart3, FileText, Database, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Costs', href: '/costs', icon: TrendingUp },
    { name: 'Sales', href: '/sales', icon: ShoppingCart },
    { name: 'Purchases', href: '/purchases', icon: ShoppingBag },
    { name: 'Stock', href: '/stock', icon: Database },
    { name: 'Payments', href: '/payments', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden mr-2 text-gray-600 hover:text-gray-900"
            onClick={toggleSidebar}
          >
            <Database className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleSidebar}></div>
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50">
            <Sidebar 
              navigationItems={navigationItems} 
              activePath={pathname} 
              onNavigate={toggleSidebar} 
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          navigationItems={navigationItems} 
          activePath={pathname} 
        />
      </div>
    </header>
  );
}