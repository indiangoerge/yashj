import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Edit2, 
  Trash2, 
  Plus, 
  Search,
  Download,
  Calendar
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useEstimates } from '../hooks/useEstimates';
import { formatCurrency } from '../utils/calculations';
import { generateEstimatePDF } from '../utils/pdfGenerator';
import { format } from 'date-fns';

const EstimatesList: React.FC = () => {
  const { estimates, deleteEstimate } = useEstimates();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'containerId' | 'totalCost'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredEstimates = estimates
    .filter(estimate => 
      estimate.containerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'containerId':
          aValue = a.containerId.toLowerCase();
          bValue = b.containerId.toLowerCase();
          break;
        case 'totalCost':
          aValue = a.totalCost;
          bValue = b.totalCost;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleDelete = (id: string, containerId: string) => {
    if (window.confirm(`Are you sure you want to delete estimate for container ${containerId}?`)) {
      deleteEstimate(id);
    }
  };

  const handleDownloadPDF = (estimate: any) => {
    generateEstimatePDF(estimate, true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Past Estimates</h1>
          <p className="text-gray-600 mt-1">Manage and review your export estimates</p>
        </div>
        <Link to="/create-estimate">
          <Button icon={Plus}>Create New Estimate</Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search by container ID or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">Sort by Date</option>
              <option value="containerId">Sort by Container ID</option>
              <option value="totalCost">Sort by Total Cost</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Estimates Table */}
      <Card>
        {filteredEstimates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Container ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEstimates.map((estimate) => (
                  <tr key={estimate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {estimate.containerId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(estimate.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {estimate.products.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(estimate.totalCost)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {estimate.marginApplied.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{estimate.createdBy}</div>
                        <div className="text-xs text-gray-400 capitalize">{estimate.role}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link to={`/estimate/${estimate.id}`}>
                          <Button variant="ghost" size="sm" icon={Eye}>
                            View
                          </Button>
                        </Link>
                        <Link to={`/edit-estimate/${estimate.id}`}>
                          <Button variant="ghost" size="sm" icon={Edit2}>
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Download}
                          onClick={() => handleDownloadPDF(estimate)}
                        >
                          PDF
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(estimate.id, estimate.containerId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No estimates found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first estimate'}
            </p>
            <Link to="/create-estimate">
              <Button icon={Plus}>Create New Estimate</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EstimatesList;