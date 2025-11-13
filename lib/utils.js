// lib/utils.js
import { format } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy hh:mm a');
};

export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
};

export const calculateProfit = (revenue, cost) => {
  return revenue - cost;
};

export const calculateProfitMargin = (revenue, cost) => {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
};

export const generateReportData = (data, type) => {
  switch (type) {
    case 'sales-targets':
      return data.map(item => ({
        id: item._id,
        date: formatDate(item.date),
        target: formatCurrency(item.target),
        actual: formatCurrency(item.actual),
        variance: formatCurrency(item.actual - item.target),
        percentage: `${((item.actual / item.target) * 100).toFixed(2)}%`,
        status: item.actual >= item.target ? 'achieved' : 'below-target'
      }));
    case 'cost-price':
      return data.map(item => ({
        id: item._id,
        product: item.product?.name || 'Unknown Product',
        cost: formatCurrency(item.cost),
        price: formatCurrency(item.price),
        margin: `${calculateProfitMargin(item.price, item.cost).toFixed(2)}%`,
        profit: formatCurrency(calculateProfit(item.price, item.cost))
      }));
    case 'stock-levels':
      return data.map(item => ({
        id: item._id,
        product: item.product?.name || 'Unknown Product',
        current: item.current,
        minimum: item.minimum,
        status: item.current <= item.minimum ? 'low' : 'adequate'
      }));
    case 'customer-balances':
      return data.map(item => ({
        id: item._id,
        customer: item.customer?.name || 'Unknown Customer',
        balance: formatCurrency(item.balance),
        status: item.balance < 0 ? 'overdue' : item.balance > 0 ? 'outstanding' : 'paid'
      }));
    case 'profitability':
      return data.map(item => ({
        id: item._id,
        period: item.period,
        revenue: formatCurrency(item.revenue),
        costs: formatCurrency(item.costs),
        profit: formatCurrency(item.profit),
        margin: `${item.margin.toFixed(2)}%`
      }));
    default:
      return data;
  }
};

export const getStockStatusClass = (current, minimum) => {
  if (current <= minimum) return 'bg-red-100 text-red-800';
  if (current <= minimum * 1.5) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

export const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'achieved':
      return 'bg-green-100 text-green-800';
    case 'below-target':
      return 'bg-red-100 text-red-800';
    case 'low':
      return 'bg-red-100 text-red-800';
    case 'adequate':
      return 'bg-green-100 text-green-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'outstanding':
      return 'bg-yellow-100 text-yellow-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

export const generateId = () => {
  return 'id-' + Math.random().toString(36).substr(2, 9);
};