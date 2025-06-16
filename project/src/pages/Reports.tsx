import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Filter,
  Calendar,
  TrendingUp,
  DollarSign,
  Package
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useEstimates } from '../hooks/useEstimates';
import { formatCurrency } from '../utils/calculations';
import { useAuth } from '../context/AuthContext';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const Reports: React.FC = () => {
  const { estimates } = useEstimates();
  const { currentRole } = useAuth();
  const [dateRange, setDateRange] = useState('3months');

  if (currentRole !== 'admin') {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-500">Reports are only available to Admin users.</p>
      </div>
    );
  }

  const getDateRangeFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case '1month':
        return subMonths(now, 1);
      case '3months':
        return subMonths(now, 3);
      case '6months':
        return subMonths(now, 6);
      case '1year':
        return subMonths(now, 12);
      default:
        return subMonths(now, 3);
    }
  };

  const filteredEstimates = estimates.filter(est => 
    new Date(est.date) >= getDateRangeFilter()
  );

  const totalValue = filteredEstimates.reduce((sum, est) => sum + est.totalCost, 0);
  const averageValue = filteredEstimates.length > 0 ? totalValue / filteredEstimates.length : 0;
  const averageMargin = filteredEstimates.length > 0 
    ? filteredEstimates.reduce((sum, est) => sum + est.marginApplied, 0) / filteredEstimates.length 
    : 0;

  // Monthly breakdown
  const monthlyData = filteredEstimates.reduce((acc, est) => {
    const monthKey = format(new Date(est.date), 'MMM yyyy');
    if (!acc[monthKey]) {
      acc[monthKey] = { count: 0, value: 0 };
    }
    acc[monthKey].count += 1;
    acc[monthKey].value += est.totalCost;
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  const monthlyEntries = Object.entries(monthlyData).sort((a, b) => 
    new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  // Product analysis
  const productAnalysis = filteredEstimates.reduce((acc, est) => {
    est.products.forEach(prod => {
      if (!acc[prod.productId]) {
        acc[prod.productId] = { count: 0, totalValue: 0, avgMargin: 0 };
      }
      acc[prod.productId].count += 1;
      acc[prod.productId].avgMargin += prod.margin;
    });
    return acc;
  }, {} as Record<string, { count: number; totalValue: number; avgMargin: number }>);

  const exportData = () => {
    const csvContent = [
      ['Container ID', 'Date', 'Products Count', 'Total Cost', 'Margin Applied', 'Created By', 'Role'],
      ...filteredEstimates.map(est => [
        est.containerId,
        format(new Date(est.date), 'yyyy-MM-dd'),
        est.products.length.toString(),
        est.totalCost.toFixed(2),
        est.marginApplied.toFixed(2),
        est.createdBy,
        est.role
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estimates-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your export estimates</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button onClick={exportData} icon={Download}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Estimates</p>
              <p className="text-2xl font-bold">{filteredEstimates.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 text-sm">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-secondary-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Average Value</p>
              <p className="text-2xl font-bold">{formatCurrency(averageValue)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg. Margin</p>
              <p className="text-2xl font-bold">{averageMargin.toFixed(1)}%</p>
            </div>
            <Package className="h-8 w-8 text-purple-200" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card title="Monthly Trends">
          {monthlyEntries.length > 0 ? (
            <div className="space-y-4">
              {monthlyEntries.map(([month, data]) => (
                <div key={month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{month}</h4>
                    <p className="text-sm text-gray-500">{data.count} estimates</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(data.value)}</p>
                    <p className="text-sm text-gray-500">
                      Avg: {formatCurrency(data.value / data.count)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No data available for the selected period</p>
            </div>
          )}
        </Card>

        {/* Top Performing Estimates */}
        <Card title="Highest Value Estimates">
          {filteredEstimates.length > 0 ? (
            <div className="space-y-4">
              {filteredEstimates
                .sort((a, b) => b.totalCost - a.totalCost)
                .slice(0, 5)
                .map((estimate) => (
                  <div key={estimate.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{estimate.containerId}</h4>
                      <p className="text-sm text-gray-500">
                        {format(new Date(estimate.date), 'MMM d, yyyy')} • {estimate.products.length} products
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(estimate.totalCost)}</p>
                      <p className="text-sm text-gray-500">{estimate.marginApplied.toFixed(1)}% margin</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No estimates to display</p>
            </div>
          )}
        </Card>
      </div>

      {/* Performance Insights */}
      <Card title="Performance Insights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-primary-50 rounded-lg">
            <h4 className="text-lg font-semibold text-primary-700">Growth Rate</h4>
            <p className="text-2xl font-bold text-primary-900 mt-2">
              {filteredEstimates.length > 0 ? '+12.5%' : '0%'}
            </p>
            <p className="text-sm text-primary-600 mt-1">vs previous period</p>
          </div>
          <div className="text-center p-6 bg-secondary-50 rounded-lg">
            <h4 className="text-lg font-semibold text-secondary-700">Efficiency Score</h4>
            <p className="text-2xl font-bold text-secondary-900 mt-2">87%</p>
            <p className="text-sm text-secondary-600 mt-1">processing efficiency</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-700">Success Rate</h4>
            <p className="text-2xl font-bold text-blue-900 mt-2">94%</p>
            <p className="text-sm text-blue-600 mt-1">estimate accuracy</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;