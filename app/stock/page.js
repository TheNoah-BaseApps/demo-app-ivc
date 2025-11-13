'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, DollarSign, ShoppingCart, CreditCard, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    stockValue: 0,
    pendingPayments: 0,
    lowStockItems: 0
  });

  const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data fetching
    const fetchData = async () => {
      try {
        // In a real app, this would be API calls
        setTimeout(() => {
          setStats({
            totalProducts: 142,
            totalSales: 284500,
            totalPurchases: 192300,
            stockValue: 89200,
            pendingPayments: 12,
            lowStockItems: 5
          });

          setSalesData([
            { month: 'Jan', sales: 4000, purchases: 2400 },
            { month: 'Feb', sales: 3000, purchases: 1398 },
            { month: 'Mar', sales: 2000, purchases: 9800 },
            { month: 'Apr', sales: 2780, purchases: 3908 },
            { month: 'May', sales: 1890, purchases: 4800 },
            { month: 'Jun', sales: 2390, purchases: 3800 },
          ]);

          setStockData([
            { name: 'Electronics', value: 45 },
            { name: 'Clothing', value: 25 },
            { name: 'Home & Garden', value: 15 },
            { name: 'Books', value: 10 },
            { name: 'Other', value: 5 },
          ]);

          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your ERP system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
            <p className="text-xs text-gray-500">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalPurchases)}</div>
            <p className="text-xs text-gray-500">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.stockValue)}</div>
            <p className="text-xs text-gray-500">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales & Purchases Trend</CardTitle>
            <CardDescription>Monthly comparison of sales and purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                <Bar dataKey="purchases" fill="#10b981" name="Purchases" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">New Sale Created</p>
                  <p className="text-sm text-gray-500">Samsung Galaxy S23 - $1,299</p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Stock Updated</p>
                  <p className="text-sm text-gray-500">Laptop Case - Quantity increased</p>
                  <p className="text-xs text-gray-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Payment Received</p>
                  <p className="text-sm text-gray-500">Order #1001 - $850</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Low Stock Alert</p>
                  <p className="text-sm text-gray-500">Wireless Headphones - 3 left</p>
                  <p className="text-xs text-gray-400">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access key modules quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-6 h-auto"
                onClick={() => router.push('/products')}
              >
                <Package className="h-8 w-8 mb-2" />
                <span>Products</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-6 h-auto"
                onClick={() => router.push('/sales')}
              >
                <ShoppingCart className="h-8 w-8 mb-2" />
                <span>Sales</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-6 h-auto"
                onClick={() => router.push('/purchases')}
              >
                <TrendingUp className="h-8 w-8 mb-2" />
                <span>Purchases</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-6 h-auto"
                onClick={() => router.push('/stock')}
              >
                <Package className="h-8 w-8 mb-2" />
                <span>Stock</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-6 h-auto"
                onClick={() => router.push('/payments')}
              >
                <CreditCard className="h-8 w-8 mb-2" />
                <span>Payments</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-6 h-auto"
                onClick={() => router.push('/reports')}
              >
                <TrendingDown className="h-8 w-8 mb-2" />
                <span>Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}