'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Home, 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  Database, 
  CreditCard, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Costs', href: '/costs', icon: TrendingUp },
  { name: 'Sales', href: '/sales', icon: ShoppingCart },
  { name: 'Purchases', href: '/purchases', icon: Database },
  { name: 'Stock', href: '/stock', icon: Package },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">{process.env.NEXT_PUBLIC_APP_NAME}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => router.push(item.href)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-red-600 hover:bg-gray-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => {
                    router.push(item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-gray-50"
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}