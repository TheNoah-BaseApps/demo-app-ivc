'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart as CartIcon,
  Package2,
  TrendingUp as TrendUp,
  TrendingDown as TrendDown
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/purchases');
        if (!response.ok) {
          throw new Error('Failed to fetch purchases');
        }
        const data = await response.json();
        setPurchases(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const recentPurchases = purchases.slice(0, 5);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center text-red-700">
              <TrendingDown className="h-5 w-5 mr-2" />
              <span>Error loading purchases: {error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
          <p className="text-gray-600 mt-2">Manage and track your purchase transactions</p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Package className="h-4 w-4 mr-2" />
          Add Purchase
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPurchases)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Purchases</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases.length}</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Purchase</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {purchases.length ? formatCurrency(totalPurchases / purchases.length) : '$0.00'}
            </div>
            <p className="text-xs text-muted-foreground">+12.3% from last quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchases Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Recent Purchases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Supplier</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((purchase) => (
                  <tr key={purchase._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{purchase.supplier?.name || 'N/A'}</td>
                    <td className="py-3 px-4">{new Date(purchase.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{purchase.items?.length || 0} items</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(purchase.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={purchase.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {purchase.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {purchases.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No purchases recorded yet</p>
              <p className="text-sm mt-2">Add your first purchase to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Purchase Button */}
      <div className="flex justify-end">
        <Button>
          <Package className="h-4 w-4 mr-2" />
          Record New Purchase
        </Button>
      </div>
    </div>
  );
}