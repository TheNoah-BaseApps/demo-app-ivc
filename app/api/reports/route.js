import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Cost from '@/models/Cost';
import Product from '@/models/Product';
import Stock from '@/models/Stock';
import Payment from '@/models/Payment';

export async function GET(request) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');

    switch (reportType) {
      case 'sales-targets': {
        // Get sales data and compare against targets
        const sales = await Sale.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m', date: '$date' }
              },
              totalSales: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);

        // Get targets (simplified - in real app this would come from a targets collection)
        const targets = [
          { month: '2023-01', target: 10000 },
          { month: '2023-02', target: 12000 },
          { month: '2023-03', target: 15000 },
          { month: '2023-04', target: 18000 },
        ];

        const result = {
          monthlySales: sales.map(sale => {
            const target = targets.find(t => t.month === sale._id) || { target: 0 };
            return {
              month: sale._id,
              actual: sale.totalSales,
              target: target.target,
              variance: sale.totalSales - target.target,
              percentage: target.target ? (sale.totalSales / target.target) * 100 : 0
            };
          })
        };

        return NextResponse.json(result);
      }

      case 'cost-price': {
        // Get cost vs price comparison for products
        const products = await Product.aggregate([
          {
            $lookup: {
              from: 'costs',
              localField: '_id',
              foreignField: 'productId',
              as: 'costs'
            }
          },
          {
            $project: {
              name: 1,
              price: 1,
              totalCost: { $sum: '$costs.amount' },
              costCount: { $size: '$costs' }
            }
          }
        ]);

        const result = {
          productComparison: products.map(product => ({
            productName: product.name,
            sellingPrice: product.price,
            totalCost: product.totalCost,
            margin: product.price - product.totalCost,
            marginPercentage: product.price ? ((product.price - product.totalCost) / product.price) * 100 : 0
          }))
        };

        return NextResponse.json(result);
      }

      case 'stock-levels': {
        // Get current stock levels
        const stockLevels = await Stock.aggregate([
          {
            $lookup: {
              from: 'products',
              localField: 'productId',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $unwind: '$product'
          },
          {
            $group: {
              _id: '$productId',
              productName: { $first: '$product.name' },
              currentStock: { $sum: '$quantity' },
              minValue: { $first: '$minStockLevel' }
            }
          },
          {
            $project: {
              _id: 0,
              productId: '$_id',
              productName: 1,
              currentStock: 1,
              minValue: 1,
              status: {
                $cond: {
                  if: { $lt: ['$currentStock', '$minValue'] },
                  then: 'Low Stock',
                  else: 'Normal'
                }
              }
            }
          }
        ]);

        const result = {
          stockLevels: stockLevels,
          lowStockItems: stockLevels.filter(item => item.status === 'Low Stock').length
        };

        return NextResponse.json(result);
      }

      case 'customer-balances': {
        // Get customer payment balances
        const payments = await Payment.aggregate([
          {
            $group: {
              _id: '$customerId',
              totalAmount: { $sum: '$amount' },
              totalPaid: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]);

        const result = {
          customerBalances: payments.map(payment => ({
            customerId: payment._id,
            totalAmount: payment.totalAmount,
            totalPaid: payment.totalPaid,
            balance: payment.totalAmount - payment.totalPaid
          }))
        };

        return NextResponse.json(result);
      }

      case 'profitability': {
        // Calculate overall profitability
        const salesData = await Sale.aggregate([
          {
            $group: {
              _id: null,
              totalSales: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]);

        const costsData = await Cost.aggregate([
          {
            $group: {
              _id: null,
              totalCosts: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]);

        const totalSales = salesData[0]?.totalSales || 0;
        const totalCosts = costsData[0]?.totalCosts || 0;
        const profit = totalSales - totalCosts;
        const profitMargin = totalSales ? (profit / totalSales) * 100 : 0;

        const result = {
          financialSummary: {
            totalSales: totalSales,
            totalCosts: totalCosts,
            profit: profit,
            profitMargin: profitMargin
          }
        };

        return NextResponse.json(result);
      }

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}