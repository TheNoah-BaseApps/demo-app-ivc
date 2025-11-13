'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalStock: 0,
    pendingPayments: 0,
    lowStockItems: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, this would be API calls
        await new Promise(resolve => setTimeout(resolve, 500));

        setStats({
          totalProducts: 142,
          totalSales: 2847,
          totalPurchases: 1890,
          totalStock: 5642,
          pendingPayments: 23,
          lowStockItems: 8
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNavigate = (path) => {
    router.push(path);
  };

  const StatCard = ({ icon: Icon, title, value, change, isPositive }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <div className={`flex items-center mt-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {change}
              </div>
            )}
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to ERP Demo - Your business management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Package}
          title="Total Products"
          value={stats.totalProducts}
          change="+12% from last month"
          isPositive={true}
        />
        <StatCard
          icon={DollarSign}
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString()}`}
          change="+8% from last month"
          isPositive={true}
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Purchases"
          value={`$${stats.totalPurchases.toLocaleString()}`}
          change="+5% from last month"
          isPositive={true}
        />
        <StatCard
          icon={Package}
          title="Current Stock"
          value={stats.totalStock}
          change="+2% from last month"
          isPositive={true}
        />
        <StatCard
          icon={Clock}
          title="Pending Payments"
          value={stats.pendingPayments}
          change="3 new today"
          isPositive={true}
        />
        <StatCard
          icon={AlertCircle}
          title="Low Stock Items"
          value={stats.lowStockItems}
          change="5 items below threshold"
          isPositive={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">New product added</p>
                  <p className="text-sm text-gray-600">Smartphone X was added to inventory</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Sale completed</p>
                  <p className="text-sm text-gray-600">Order #12345 was processed</p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Low stock alert</p>
                  <p className="text-sm text-gray-600">Laptop Y stock below threshold</p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={() => handleNavigate('/products')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
              <Button 
                onClick={() => handleNavigate('/sales')} 
                className="w-full justify-start"
                variant="outline"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Record Sale
              </Button>
              <Button 
                onClick={() => handleNavigate('/purchases')} 
                className="w-full justify-start"
                variant="outline"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Record Purchase
              </Button>
              <Button 
                onClick={() => handleNavigate('/stock')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Package className="h-4 w-4 mr-2" />
                Check Stock Levels
              </Button>
              <Button 
                onClick={() => handleNavigate('/payments')} 
                className="w-full justify-start"
                variant="outline"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Process Payments
              </Button>
              <Button 
                onClick={() => handleNavigate('/reports')} 
                className="w-full justify-start"
                variant="outline"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}