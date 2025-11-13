'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Users,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StockPage() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('/api/stock');
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        const data = await response.json();
        setStockData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const handleAddStock = () => {
    router.push('/stock/add');
  };

  const handleViewDetails = (id) => {
    router.push(`/stock/${id}`);
  };

  const getStockStatus = (quantity, minStock) => {
    if (quantity <= 0) return { status: 'out-of-stock', label: 'Out of Stock', color: 'red' };
    if (quantity <= minStock) return { status: 'low-stock', label: 'Low Stock', color: 'orange' };
    return { status: 'in-stock', label: 'In Stock', color: 'green' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600 mt-2">
            Manage current inventory levels and stock quantities
          </p>
        </div>
        <Button onClick={handleAddStock} className="bg-blue-600 hover:bg-blue-700">
          <Package className="mr-2 h-4 w-4" />
          Add Stock
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stockData.length}
            </div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stockData.filter(item => item.quantity <= item.minStock).length}
            </div>
            <p className="text-xs text-muted-foreground">Items requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stockData.reduce((total, item) => total + (item.quantity * item.cost), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Below Min</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stockData.filter(item => 
                item.quantity > 0 && item.quantity <= item.minStock
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Stock below minimum threshold</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Current Stock Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockData.length > 0 ? (
                  stockData.map((item) => {
                    const status = getStockStatus(item.quantity, item.minStock);
                    return (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Package className="h-5 w-5 text-gray-500" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.category || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.minStock}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={status.color === 'green' ? 'default' : status.color === 'orange' ? 'destructive' : 'secondary'}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(item._id)}
                            className="mr-2"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No stock data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}