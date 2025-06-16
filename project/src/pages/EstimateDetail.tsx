import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Download, 
  Package, 
  Calendar,
  User,
  Calculator
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useEstimates } from '../hooks/useEstimates';
import { PRODUCTS } from '../data/products';
import { calculatePricing, formatCurrency } from '../utils/calculations';
import { generateEstimatePDF } from '../utils/pdfGenerator';
import { format } from 'date-fns';

const EstimateDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEstimate } = useEstimates();

  const estimate = id ? getEstimate(id) : null;

  if (!estimate) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Estimate not found</h3>
        <p className="text-gray-500 mb-6">The estimate you're looking for doesn't exist.</p>
        <Link to="/estimates">
          <Button>Back to Estimates</Button>
        </Link>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    generateEstimatePDF(estimate, true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/estimates')}
            icon={ArrowLeft}
          >
            Back to Estimates
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Container {estimate.containerId}
            </h1>
            <p className="text-gray-600 mt-1">
              Estimate Details and Breakdown
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link to={`/edit-estimate/${estimate.id}`}>
            <Button variant="outline" icon={Edit2}>
              Edit Estimate
            </Button>
          </Link>
          <Button onClick={handleDownloadPDF} icon={Download}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(estimate.totalCost)}</p>
            </div>
            <Calculator className="h-8 w-8 text-primary-200" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Products</p>
              <p className="text-2xl font-bold text-gray-900">{estimate.products.length}</p>
            </div>
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Margin</p>
              <p className="text-2xl font-bold text-gray-900">{estimate.marginApplied.toFixed(1)}%</p>
            </div>
            <Calculator className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Date Created</p>
              <p className="text-lg font-semibold text-gray-900">
                {format(new Date(estimate.date), 'MMM d')}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(estimate.date), 'yyyy')}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Estimate Info */}
      <Card title="Estimate Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Container ID</label>
            <p className="mt-1 text-sm text-gray-900">{estimate.containerId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Created By</label>
            <div className="mt-1 flex items-center space-x-1">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900">{estimate.createdBy}</span>
              <span className="text-xs text-gray-500 capitalize">({estimate.role})</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Created</label>
            <p className="mt-1 text-sm text-gray-900">
              {format(new Date(estimate.date), 'PPpp')}
            </p>
          </div>
        </div>
      </Card>

      {/* Product Details */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Product Breakdown</h2>
        
        {estimate.products.map((productEstimate, index) => {
          const product = PRODUCTS.find(p => p.id === productEstimate.productId);
          const pricing = calculatePricing(productEstimate);

          if (!product) return null;

          return (
            <Card key={productEstimate.productId} title={product.name} subtitle={product.category}>
              <div className="space-y-6">
                {/* Pricing Summary */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Calculated Pricing</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Procurement Cost</p>
                      <p className="text-lg font-semibold text-primary-700">
                        {formatCurrency(pricing.procurementCost)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Importer Cost</p>
                      <p className="text-lg font-semibold text-secondary-700">
                        {formatCurrency(pricing.importerCost)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Distributor Price</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {formatCurrency(pricing.distributorPrice)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Retailer Price</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {formatCurrency(pricing.retailerPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Origin Costs */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Origin Costs</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Raw Material Cost:</span>
                        <span className="font-medium">{formatCurrency(productEstimate.originCost.rawMaterialCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transport Cost:</span>
                        <span className="font-medium">{formatCurrency(productEstimate.originCost.transportCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Packing Cost:</span>
                        <span className="font-medium">{formatCurrency(productEstimate.originCost.packingCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fumigation Cost:</span>
                        <span className="font-medium">{formatCurrency(productEstimate.originCost.fumigationCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customs Clearance:</span>
                        <span className="font-medium">{formatCurrency(productEstimate.originCost.customsClearanceCost)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-3">
                        <span className="text-gray-600">Margin Applied:</span>
                        <span className="font-medium">{productEstimate.margin}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Logistics Costs */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Logistics Costs</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Freight Cost:</span>
                        <span className="font-medium">{formatCurrency(productEstimate.logisticsCost.freightCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Import Duty:</span>
                        <span className="font-medium">{formatCurrency(productEstimate.logisticsCost.importDuty)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customs Clearance:</span>
                        <span className="font-medium">{formatCurrency(productEstimate.logisticsCost.customsClearance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transport to Destination:</span>
                        <span className="font-medium">{formatCurrency(productEstimate.logisticsCost.transportToDestination)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-3">
                        <span className="text-gray-600">Distributor Margin:</span>
                        <span className="font-medium">{productEstimate.distributorMargin}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Retailer Margin:</span>
                        <span className="font-medium">{productEstimate.retailerMargin}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EstimateDetail;