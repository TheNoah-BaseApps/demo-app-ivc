'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Package, 
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('/api/payments');
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
        setPayments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

  // Calculate payment summary statistics
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <CreditCard className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments}</div>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.customer?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={payment.status === 'completed' ? 'default' : 'secondary'}
                        className={
                          payment.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.method || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-blue-100 rounded-full">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Credit Card</p>
                <p className="text-xs text-gray-500">4 payments</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-green-100 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Cash</p>
                <p className="text-xs text-gray-500">2 payments</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-purple-100 rounded-full">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Bank Transfer</p>
                <p className="text-xs text-gray-500">3 payments</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}