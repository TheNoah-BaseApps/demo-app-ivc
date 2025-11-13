'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  ShoppingCart,
  FileText,
  ShoppingCart as PurchaseIcon,
  Database,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Costs', href: '/costs', icon: FileText },
  { name: 'Sales', href: '/sales', icon: ShoppingCart },
  { name: 'Purchases', href: '/purchases', icon: PurchaseIcon },
  { name: 'Stock', href: '/stock', icon: Database },
  { name: 'Payments', href: '/payments', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white shadow-md">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <Link href="/dashboard" className="flex items-center space-x-2 text-white">
            <BarChart3 className="h-8 w-8" />
            <span className="text-xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
          </Link>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">User</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}