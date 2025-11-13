'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, TrendingUp, ShoppingCart, Package, DollarSign, Users } from 'lucide-react';
import axios from 'axios';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalStock: 0,
    totalRevenue: 0,
    totalCosts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, salesRes, purchasesRes, stockRes, revenueRes, costsRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/sales'),
          axios.get('/api/purchases'),
          axios.get('/api/stock'),
          axios.get('/api/reports/sales-targets'),
          axios.get('/api/reports/cost-price')
        ]);

        const productCount = productsRes.data.data.length;
        const salesCount = salesRes.data.data.length;
        const purchasesCount = purchasesRes.data.data.length;
        const stockValue = stockRes.data.data.reduce((acc, item) => acc + (item.quantity * item.costPrice), 0);
        const revenue = revenueRes.data.data.reduce((acc, item) => acc + item.totalAmount, 0);
        const costs = costsRes.data.data.reduce((acc, item) => acc + item.amount, 0);

        setStats({
          totalProducts: productCount,
          totalSales: salesCount,
          totalPurchases: purchasesCount,
          totalStock: stockValue,
          totalRevenue: revenue,
          totalCosts: costs
        });

        // Mock recent activity
        setRecentActivity([
          { id: 1, type: 'sale', description: 'Sale #1001 recorded', time: '2 hours ago' },
          { id: 2, type: 'purchase', description: 'Purchase #2001 completed', time: '5 hours ago' },
          { id: 3, type: 'product', description: 'New product added: Widget Pro', time: '1 day ago' },
          { id: 4, type: 'stock', description: 'Stock level updated for Item #5001', time: '2 days ago' }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to ERP Demo - Your business management center</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">+18.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPurchases}</div>
            <p className="text-xs text-muted-foreground">+12.7% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalStock)}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="mt-1">
                      {activity.type === 'sale' && <ShoppingCart className="h-5 w-5 text-green-500" />}
                      {activity.type === 'purchase' && <Package className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'product' && <Package className="h-5 w-5 text-purple-500" />}
                      {activity.type === 'stock' && <TrendingUp className="h-5 w-5 text-orange-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common operations you can perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Record New Sale
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Record New Purchase
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}