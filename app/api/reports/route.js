import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Product from '@/models/Product';
import Cost from '@/models/Cost';
import Stock from '@/models/Stock';
import Payment from '@/models/Payment';

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');

    switch (reportType) {
      case 'sales-targets': {
        // Get sales data with targets
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

        const targets = [
          { period: '2024-01', target: 50000 },
          { period: '2024-02', target: 55000 },
          { period: '2024-03', target: 60000 },
          { period: '2024-04', target: 65000 },
          { period: '2024-05', target: 70000 },
          { period: '2024-06', target: 75000 },
          { period: '2024-07', target: 80000 },
          { period: '2024-08', target: 85000 },
          { period: '2024-09', target: 90000 },
          { period: '2024-10', target: 95000 },
          { period: '2024-11', target: 100000 },
          { period: '2024-12', target: 105000 }
        ];

        // Combine sales and targets
        const reportData = targets.map(target => {
          const sale = sales.find(s => s._id === target.period);
          return {
            period: target.period,
            sales: sale ? sale.totalSales : 0,
            target: target.target,
            variance: target.target - (sale ? sale.totalSales : 0)
          };
        });

        return NextResponse.json({
          report: 'sales-targets',
          data: reportData
        });
      }

      case 'cost-price': {
        // Get cost vs price comparison
        const products = await Product.find({}, { name: 1, costPrice: 1, sellingPrice: 1 });

        const reportData = products.map(product => ({
          productId: product._id,
          productName: product.name,
          costPrice: product.costPrice,
          sellingPrice: product.sellingPrice,
          margin: product.sellingPrice - product.costPrice,
          marginPercentage: ((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100
        }));

        return NextResponse.json({
          report: 'cost-price',
          data: reportData
        });
      }

      case 'stock-levels': {
        // Get stock levels report
        const stockLevels = await Stock.aggregate([
          {
            $group: {
              _id: '$product',
              totalQuantity: { $sum: '$quantity' }
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: '_id',
              foreignField: '_id',
              as: 'productInfo'
            }
          },
          {
            $unwind: '$productInfo'
          },
          {
            $project: {
              productId: '$_id',
              productName: '$productInfo.name',
              totalQuantity: 1,
              productCategory: '$productInfo.category'
            }
          }
        ]);

        const lowStockProducts = stockLevels.filter(item => item.totalQuantity < 10);

        return NextResponse.json({
          report: 'stock-levels',
          data: {
            stockLevels,
            lowStockProducts
          }
        });
      }

      case 'customer-balances': {
        // Get customer balances report
        const payments = await Payment.find({}, { customer: 1, amount: 1, type: 1 });

        const customerBalances = payments.reduce((acc, payment) => {
          const key = payment.customer;
          if (!acc[key]) {
            acc[key] = { customer: key, balance: 0 };
          }

          if (payment.type === 'received') {
            acc[key].balance += payment.amount;
          } else {
            acc[key].balance -= payment.amount;
          }

          return acc;
        }, {});

        const reportData = Object.values(customerBalances);

        return NextResponse.json({
          report: 'customer-balances',
          data: reportData
        });
      }

      case 'profitability': {
        // Get profitability report
        const sales = await Sale.find({}, { amount: 1, date: 1 });
        const costs = await Cost.find({}, { amount: 1, date: 1 });

        const salesTotal = sales.reduce((sum, sale) => sum + sale.amount, 0);
        const costsTotal = costs.reduce((sum, cost) => sum + cost.amount, 0);
        const profit = salesTotal - costsTotal;
        const profitMargin = salesTotal > 0 ? (profit / salesTotal) * 100 : 0;

        const monthlySales = await Sale.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m', date: '$date' }
              },
              total: { $sum: '$amount' }
            }
          },
          { $sort: { _id: 1 } }
        ]);

        const monthlyCosts = await Cost.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m', date: '$date' }
              },
              total: { $sum: '$amount' }
            }
          },
          { $sort: { _id: 1 } }
        ]);

        const monthlyProfitability = monthlySales.map(sale => {
          const cost = monthlyCosts.find(c => c._id === sale._id);
          const monthlyProfit = sale.total - (cost ? cost.total : 0);
          const margin = sale.total > 0 ? (monthlyProfit / sale.total) * 100 : 0;

          return {
            period: sale._id,
            sales: sale.total,
            costs: cost ? cost.total : 0,
            profit: monthlyProfit,
            margin: margin
          };
        });

        return NextResponse.json({
          report: 'profitability',
          data: {
            totalSales: salesTotal,
            totalCosts: costsTotal,
            profit,
            profitMargin,
            monthlyData: monthlyProfitability
          }
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}