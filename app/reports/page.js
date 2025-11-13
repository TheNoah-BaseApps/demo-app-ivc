'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, CreditCard, AlertCircle } from 'lucide-react';

const ReportsPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for demonstration - in a real app, this would fetch from APIs
        const mockSales = [
          { month: 'Jan', revenue: 4000, target: 3500 },
          { month: 'Feb', revenue: 3000, target: 4000 },
          { month: 'Mar', revenue: 2000, target: 2500 },
          { month: 'Apr', revenue: 2780, target: 2000 },
          { month: 'May', revenue: 1890, target: 2500 },
          { month: 'Jun', revenue: 2390, target: 3000 },
        ];

        const mockCosts = [
          { category: 'Materials', amount: 12000 },
          { category: 'Labor', amount: 8000 },
          { category: 'Overhead', amount: 5000 },
          { category: 'Maintenance', amount: 3000 },
        ];

        const mockStock = [
          { product: 'Laptop', stock: 15 },
          { product: 'Mouse', stock: 42 },
          { product: 'Keyboard', stock: 28 },
          { product: 'Monitor', stock: 10 },
          { product: 'Headphones', stock: 35 },
        ];

        const mockPayments = [
          { type: 'Sales', amount: 35000 },
          { type: 'Purchases', amount: 22000 },
          { type: 'Costs', amount: 28000 },
        ];

        setSalesData(mockSales);
        setCostData(mockCosts);
        setStockData(mockStock);
        setPaymentData(mockPayments);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reports data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-500">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
        <p className="text-gray-600 mt-2">Comprehensive business insights and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">$45,230</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">12% increase</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-900">1,248</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">8% increase</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Items</p>
              <p className="text-2xl font-semibold text-gray-900">86</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600 ml-1">3% decrease</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <CreditCard className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-semibold text-gray-900">$5,320</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">5% increase</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales vs Targets</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                <Bar dataKey="target" fill="#10b981" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost Breakdown</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {costData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Stock Levels</h2>
          <div className="space-y-4">
            {stockData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.product}</span>
                  <span className="text-sm font-medium text-gray-700">{item.stock}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(item.stock / 50) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
          <div className="space-y-4">
            {paymentData.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-700">{item.type}</span>
                <span className="font-semibold text-gray-900">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profitability</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium text-green-800">Gross Profit</span>
                <span className="font-semibold text-green-800">$18,230</span>
              </div>
              <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium text-blue-800">Net Profit</span>
                <span className="font-semibold text-blue-800">$8,450</span>
              </div>
              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-2/3"></div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium text-purple-800">Profit Margin</span>
                <span className="font-semibold text-purple-800">18.7%</span>
              </div>
              <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;