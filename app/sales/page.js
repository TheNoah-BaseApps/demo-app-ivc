'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import axios from 'axios';

export default function SalesPage() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('/api/sales');
        setSalesData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch sales data');
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const recentSales = salesData.slice(0, 5);

  const totalSales = salesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalOrders = salesData.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Error loading data</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600">Track and manage all sales transactions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <ShoppingCart className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              8.2% increase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-red-500 flex items-center">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              2.1% decrease
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              3.7% increase
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-4">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Order #{sale.orderId}</h3>
                        <p className="text-sm text-gray-500">{sale.customerName} • {new Date(sale.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${sale.totalAmount.toFixed(2)}</p>
                      <Badge 
                        className={sale.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Sale
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                View Reports
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configure Sales
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm">Follow up with customer</p>
                    <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm">Process pending returns</p>
                    <p className="text-xs text-gray-500">Today, 3:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm">Review credit limit</p>
                    <p className="text-xs text-gray-500">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}