import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Calculator,
  FileText, 
  TrendingUp, 
  Package, 
  DollarSign,
  BarChart3
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useEstimates } from '../hooks/useEstimates';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/calculations';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { estimates } = useEstimates();
  const { currentRole } = useAuth();

  const recentEstimates = estimates
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalValue = estimates.reduce((sum, est) => sum + est.totalCost, 0);
  const averageMargin = estimates.length > 0 
    ? estimates.reduce((sum, est) => sum + est.marginApplied, 0) / estimates.length 
    : 0;

  const thisMonthEstimates = estimates.filter(est => {
    const estDate = new Date(est.date);
    const now = new Date();
    return estDate.getMonth() === now.getMonth() && estDate.getFullYear() === now.getFullYear();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your export estimates overview.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/quick-estimate">
            <Button icon={Calculator} variant="outline">Quick Estimate</Button>
          </Link>
          <Link to="/create-estimate">
            <Button icon={Plus}>Create New Estimate</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Estimates</p>
              <p className="text-2xl font-bold">{estimates.length}</p>
            </div>
            <FileText className="h-8 w-8 text-primary-200" />
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
              <p className="text-blue-100 text-sm">This Month</p>
              <p className="text-2xl font-bold">{thisMonthEstimates.length}</p>
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
            <BarChart3 className="h-8 w-8 text-purple-200" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Estimates */}
        <Card title="Recent Estimates" className="lg:col-span-2">
          {recentEstimates.length > 0 ? (
            <div className="space-y-4">
              {recentEstimates.map((estimate) => (
                <div key={estimate.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Package className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{estimate.containerId}</h3>
                      <p className="text-sm text-gray-500">
                        {estimate.products.length} products • {format(new Date(estimate.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(estimate.totalCost)}</p>
                    <p className="text-sm text-gray-500">{estimate.marginApplied.toFixed(1)}% margin</p>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Link to="/estimates">
                  <Button variant="outline" className="w-full">View All Estimates</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No estimates created yet</p>
              <div className="flex flex-col space-y-2">
                <Link to="/create-estimate">
                  <Button className="w-full">Create Detailed Estimate</Button>
                </Link>
                <Link to="/quick-estimate">
                  <Button variant="outline" className="w-full">Quick Price Estimate</Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            <Link to="/create-estimate" className="block">
              <Button variant="outline" className="w-full justify-start" icon={Plus}>
                New Detailed Estimate
              </Button>
            </Link>
            <Link to="/quick-estimate" className="block">
              <Button variant="outline" className="w-full justify-start" icon={Calculator}>
                Quick Price Estimate
              </Button>
            </Link>
            <Link to="/estimates" className="block">
              <Button variant="outline" className="w-full justify-start" icon={FileText}>
                View Estimates
              </Button>
            </Link>
            {currentRole === 'admin' && (
              <>
                <Link to="/reports" className="block">
                  <Button variant="outline" className="w-full justify-start" icon={BarChart3}>
                    Generate Reports
                  </Button>
                </Link>
                <Link to="/settings" className="block">
                  <Button variant="outline" className="w-full justify-start" icon={Package}>
                    Settings
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;