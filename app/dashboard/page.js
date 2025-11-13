'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ShoppingCart, Package, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalStock: 0,
    totalRevenue: 0,
    totalCosts: 0,
    totalProfit: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    // Simulate API fetch - replace with real API calls
    const fetchDashboardData = async () => {
      // Mock data based on business requirements
      setStats({
        totalProducts: 24,
        totalSales: 156,
        totalPurchases: 89,
        totalStock: 1243,
        totalRevenue: 45678.90,
        totalCosts: 23456.78,
        totalProfit: 22222.12
      });

      setSalesData([
        { name: 'Jan', revenue: 4000, costs: 2400 },
        { name: 'Feb', revenue: 3000, costs: 1398 },
        { name: 'Mar', revenue: 2000, costs: 9800 },
        { name: 'Apr', revenue: 2780, costs: 3908 },
        { name: 'May', revenue: 1890, costs: 4800 },
        { name: 'Jun', revenue: 2390, costs: 3800 },
      ]);

      setStockData([
        { name: 'Electronics', value: 400 },
        { name: 'Clothing', value: 300 },
        { name: 'Home & Garden', value: 200 },
        { name: 'Books', value: 100 },
      ]);
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, change, isPositive }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {change}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the ERP Demo dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={Package} 
          change="+12% from last month" 
          isPositive={true} 
        />
        <StatCard 
          title="Total Sales" 
          value={stats.totalSales} 
          icon={ShoppingCart} 
          change="+8% from last month" 
          isPositive={true} 
        />
        <StatCard 
          title="Total Purchases" 
          value={stats.totalPurchases} 
          icon={CreditCard} 
          change="+5% from last month" 
          isPositive={true} 
        />
        <StatCard 
          title="Total Stock" 
          value={stats.totalStock} 
          icon={Package} 
          change="+3% from last month" 
          isPositive={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue vs Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                <Bar dataKey="costs" fill="#ef4444" name="Costs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-semibold">${stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Costs</span>
                <span className="font-semibold">${stats.totalCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Profit</span>
                <span className="font-semibold text-green-600">${stats.totalProfit.toLocaleString()}</span>
              </div>
              <div className="pt-4">
                <Button className="w-full">View Reports</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}