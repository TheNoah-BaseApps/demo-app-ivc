'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, CreditCard, AlertCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalStock: 0,
    totalPayments: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 500));

        setStats({
          totalProducts: 128,
          totalSales: 24500,
          totalPurchases: 18900,
          totalStock: 562,
          totalPayments: 32400
        });

        setSalesData([
          { month: 'Jan', sales: 4000, purchases: 2400 },
          { month: 'Feb', sales: 3000, purchases: 1398 },
          { month: 'Mar', sales: 2000, purchases: 9800 },
          { month: 'Apr', sales: 2780, purchases: 3908 },
          { month: 'May', sales: 1890, purchases: 4800 },
          { month: 'Jun', sales: 2390, purchases: 3800 },
        ]);

        setTopProducts([
          { name: 'Product A', value: 400 },
          { name: 'Product B', value: 300 },
          { name: 'Product C', value: 300 },
          { name: 'Product D', value: 200 },
          { name: 'Product E', value: 100 },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, change, trend }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`ml-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-100 rounded-full">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your ERP system dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          change="+12%"
          trend="up"
        />
        <StatCard
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString()}`}
          icon={DollarSign}
          change="+8%"
          trend="up"
        />
        <StatCard
          title="Total Purchases"
          value={`$${stats.totalPurchases.toLocaleString()}`}
          icon={ShoppingCart}
          change="+5%"
          trend="up"
        />
        <StatCard
          title="Total Stock"
          value={stats.totalStock}
          icon={Package}
          change="+3%"
          trend="up"
        />
        <StatCard
          title="Total Payments"
          value={`$${stats.totalPayments.toLocaleString()}`}
          icon={CreditCard}
          change="+2%"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales vs Purchases</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                <Bar dataKey="purchases" fill="#10b981" name="Purchases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-start p-4 border rounded-lg">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">New sale recorded</p>
              <p className="text-sm text-gray-600">Product A sold to Customer X</p>
              <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start p-4 border rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Stock updated</p>
              <p className="text-sm text-gray-600">Product B stock increased by 50 units</p>
              <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start p-4 border rounded-lg">
            <div className="p-2 bg-purple-100 rounded-full mr-4">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Payment received</p>
              <p className="text-sm text-gray-600">Payment from Customer Y for order #12345</p>
              <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}