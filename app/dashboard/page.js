'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, TrendingUp, ShoppingCart, Package, CreditCard, DollarSign, Users, Calendar, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalPayments: 0,
    stockValue: 0,
    pendingPayments: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Simulated API calls - in a real app, these would fetch from your backend
    const fetchStats = () => {
      setStats({
        totalProducts: 124,
        totalSales: 58,
        totalPurchases: 32,
        totalPayments: 45,
        stockValue: 42500.75,
        pendingPayments: 8
      });
    };

    const fetchActivities = () => {
      setRecentActivities([
        { id: 1, type: 'sale', description: 'Sale #S0045 to Customer A', amount: 1200.00, time: '2 hours ago' },
        { id: 2, type: 'purchase', description: 'Purchase #P0023 from Supplier B', amount: 3400.00, time: '5 hours ago' },
        { id: 3, type: 'payment', description: 'Payment received from Customer C', amount: 850.00, time: '1 day ago' },
        { id: 4, type: 'stock', description: 'Stock adjustment for Product X', amount: 0, time: '1 day ago' },
      ]);
    };

    fetchStats();
    fetchActivities();
  }, []);

  const modules = [
    {
      name: 'Products',
      description: 'Manage your product catalog and inventory',
      icon: Package,
      color: 'bg-blue-500',
      path: '/products'
    },
    {
      name: 'Costs',
      description: 'Track and manage your business expenses',
      icon: CreditCard,
      color: 'bg-green-500',
      path: '/costs'
    },
    {
      name: 'Sales',
      description: 'Record and manage sales transactions',
      icon: ShoppingCart,
      color: 'bg-purple-500',
      path: '/sales'
    },
    {
      name: 'Purchases',
      description: 'Record and track purchase orders',
      icon: Package,
      color: 'bg-yellow-500',
      path: '/purchases'
    },
    {
      name: 'Stock',
      description: 'Monitor and manage inventory levels',
      icon: Package,
      color: 'bg-red-500',
      path: '/stock'
    },
    {
      name: 'Payments',
      description: 'Manage customer and supplier payments',
      icon: CreditCard,
      color: 'bg-indigo-500',
      path: '/payments'
    },
    {
      name: 'Reports',
      description: 'Generate detailed business reports',
      icon: BarChart,
      color: 'bg-pink-500',
      path: '/reports'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your ERP system. Here's an overview of your business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPurchases}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Total Stock Value</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(stats.stockValue)}</div>
                <div className="flex items-center text-sm mt-2 text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>12% increase</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Pending Payments</div>
                <div className="text-2xl font-bold mt-1">{stats.pendingPayments}</div>
                <div className="flex items-center text-sm mt-2 text-red-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>3 overdue</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Recent Activity</div>
                <div className="text-2xl font-bold mt-1">18</div>
                <div className="text-sm mt-2 text-gray-500">Last 30 days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className={`p-2 rounded-full ${activity.type === 'sale' ? 'bg-green-100 text-green-600' : activity.type === 'purchase' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    {activity.type === 'sale' ? <ShoppingCart className="h-4 w-4" /> : 
                     activity.type === 'purchase' ? <Package className="h-4 w-4" /> : 
                     <CreditCard className="h-4 w-4" />}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <div className="ml-auto font-medium text-sm">
                    {activity.amount > 0 ? formatCurrency(activity.amount) : ''}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Business Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`${module.color} p-3 rounded-lg text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg">{module.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Open Module
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}