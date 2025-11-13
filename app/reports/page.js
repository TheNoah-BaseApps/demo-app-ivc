'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  Calendar,
  FileText
} from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState({
    salesVsTargets: [],
    costVsPrice: [],
    stockLevels: [],
    customerBalances: [],
    profitability: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, this would fetch from your API
        // For demonstration, we're using mock data
        const mockData = {
          salesVsTargets: [
            { month: 'Jan', actual: 4000, target: 2400 },
            { month: 'Feb', actual: 3000, target: 1398 },
            { month: 'Mar', actual: 2000, target: 9800 },
            { month: 'Apr', actual: 2780, target: 3908 },
            { month: 'May', actual: 1890, target: 4800 },
            { month: 'Jun', actual: 2390, target: 3800 },
          ],
          costVsPrice: [
            { name: 'Product A', cost: 100, price: 150 },
            { name: 'Product B', cost: 200, price: 250 },
            { name: 'Product C', cost: 150, price: 200 },
            { name: 'Product D', cost: 300, price: 350 },
          ],
          stockLevels: [
            { name: 'Product A', stock: 100 },
            { name: 'Product B', stock: 50 },
            { name: 'Product C', stock: 200 },
            { name: 'Product D', stock: 75 },
          ],
          customerBalances: [
            { customer: 'John Smith', balance: 1500 },
            { customer: 'Jane Doe', balance: -500 },
            { customer: 'Bob Johnson', balance: 2000 },
            { customer: 'Alice Brown', balance: -250 },
          ],
          profitability: {
            totalRevenue: 50000,
            totalCost: 30000,
            profit: 20000,
            profitMargin: 40
          }
        };
        setReports(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
        <p className="text-gray-600 mt-2">View comprehensive business analytics and insights</p>
      </div>

      {/* Profitability Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Profitability Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Total Revenue</span>
              </div>
              <p className="text-2xl font-bold mt-1">{formatCurrency(reports.profitability.totalRevenue)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-gray-600">Total Cost</span>
              </div>
              <p className="text-2xl font-bold mt-1">{formatCurrency(reports.profitability.totalCost)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Profit</span>
              </div>
              <p className="text-2xl font-bold mt-1">{formatCurrency(reports.profitability.profit)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Profit Margin</span>
              </div>
              <p className="text-2xl font-bold mt-1">{reports.profitability.profitMargin}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales vs Targets Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Performance vs Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reports.salesVsTargets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual Sales" />
                <Bar dataKey="target" fill="#10b981" name="Target Sales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost vs Price Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost vs Price Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reports.costVsPrice}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" fill="#ef4444" name="Cost" />
                <Bar dataKey="price" fill="#10b981" name="Price" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Current Stock Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reports.stockLevels}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="stock"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {reports.stockLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} units`, 'Stock']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Balances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.customerBalances.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{customer.customer}</p>
                    <p className="text-sm text-gray-600">
                      {customer.balance > 0 ? 'Outstanding' : 'Credit'}
                    </p>
                  </div>
                  <Badge variant={customer.balance > 0 ? "destructive" : "secondary"}>
                    {formatCurrency(customer.balance)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Export Full Report
        </Button>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Generate Custom Report
        </Button>
        <Button variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Detailed Analytics
        </Button>
      </div>
    </div>
  );
}