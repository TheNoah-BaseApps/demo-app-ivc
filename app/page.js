'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  Users,
  BarChart3,
  Calendar,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalStock: 0,
    pendingPayments: 0,
    recentSales: [],
    recentPurchases: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, this would fetch from an API
        // Simulating API response with realistic data
        await new Promise(resolve => setTimeout(resolve, 800));

        setDashboardData({
          totalProducts: 24,
          totalSales: 128,
          totalPurchases: 96,
          totalStock: 1562,
          pendingPayments: 8,
          recentSales: [
            { id: 1, customer: 'ABC Corp', amount: 2450, date: '2023-05-15' },
            { id: 2, customer: 'XYZ Ltd', amount: 1890, date: '2023-05-14' },
            { id: 3, customer: 'Tech Solutions', amount: 3200, date: '2023-05-13' }
          ],
          recentPurchases: [
            { id: 1, supplier: 'Global Supplies', amount: 1200, date: '2023-05-15' },
            { id: 2, supplier: 'Prime Distributors', amount: 2450, date: '2023-05-14' },
            { id: 3, supplier: 'National Imports', amount: 1890, date: '2023-05-13' }
          ]
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNavigation = (path) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ERP Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your enterprise resource planning system</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Products</p>
                <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
              </div>
              <Package className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Sales</p>
                <p className="text-3xl font-bold">{dashboardData.totalSales}</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Purchases</p>
                <p className="text-3xl font-bold">{dashboardData.totalPurchases}</p>
              </div>
              <TrendingDown className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100">Total Stock</p>
                <p className="text-3xl font-bold">{dashboardData.totalStock}</p>
              </div>
              <BarChart3 className="h-12 w-12 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Recent Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{sale.customer}</p>
                    <p className="text-sm text-gray-500">{sale.date}</p>
                  </div>
                  <p className="font-semibold">${sale.amount}</p>
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => handleNavigation('/sales')}
            >
              View All Sales
            </Button>
          </CardContent>
        </Card>

        {/* Recent Purchases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Recent Purchases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{purchase.supplier}</p>
                    <p className="text-sm text-gray-500">{purchase.date}</p>
                  </div>
                  <p className="font-semibold">${purchase.amount}</p>
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => handleNavigation('/purchases')}
            >
              View All Purchases
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            className="h-24 flex flex-col items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600"
            onClick={() => handleNavigation('/products')}
          >
            <Package className="h-8 w-8" />
            <span>Products</span>
          </Button>

          <Button 
            className="h-24 flex flex-col items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
            onClick={() => handleNavigation('/sales')}
          >
            <ShoppingCart className="h-8 w-8" />
            <span>Sales</span>
          </Button>

          <Button 
            className="h-24 flex flex-col items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600"
            onClick={() => handleNavigation('/purchases')}
          >
            <TrendingDown className="h-8 w-8" />
            <span>Purchases</span>
          </Button>

          <Button 
            className="h-24 flex flex-col items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600"
            onClick={() => handleNavigation('/stock')}
          >
            <Activity className="h-8 w-8" />
            <span>Stock</span>
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
              <span className="text-sm text-gray-500">Last updated 2 minutes ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}