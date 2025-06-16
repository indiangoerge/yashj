import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Calculator, Save, Plus, X } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { PRODUCTS } from '../../data/products';
import { ProductEstimate, OriginCost, LogisticsCost } from '../../types';
import { useEstimates } from '../../hooks/useEstimates';
import { useAuth } from '../../context/AuthContext';
import { calculatePricing, formatCurrency } from '../../utils/calculations';

const EstimateForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { saveEstimate, updateEstimate, getEstimate } = useEstimates();
  const { user, currentRole } = useAuth();

  const [containerId, setContainerId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productEstimates, setProductEstimates] = useState<Record<string, ProductEstimate>>({});
  const [globalMargin, setGlobalMargin] = useState(15);
  const [applyGlobalMargin, setApplyGlobalMargin] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) {
      const estimate = getEstimate(id);
      if (estimate) {
        setContainerId(estimate.containerId);
        setSelectedProducts(estimate.products.map(p => p.productId));
        const estimateMap: Record<string, ProductEstimate> = {};
        estimate.products.forEach(p => {
          estimateMap[p.productId] = p;
        });
        setProductEstimates(estimateMap);
      }
    }
  }, [id, getEstimate]);

  const createEmptyProductEstimate = (productId: string): ProductEstimate => ({
    productId,
    originCost: {
      rawMaterialCost: 0,
      transportCost: 0,
      packingCost: 0,
      fumigationCost: 0,
      customsClearanceCost: 0,
      exportDuty: 0,
    },
    logisticsCost: {
      freightCost: 0,
      importDuty: 0,
      customsClearance: 0,
      transportToDestination: 0,
    },
    margin: globalMargin,
    distributorMargin: 20,
    retailerMargin: 25,
  });

  const addProduct = (productId: string) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId]);
      setProductEstimates({
        ...productEstimates,
        [productId]: createEmptyProductEstimate(productId),
      });
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
    const newEstimates = { ...productEstimates };
    delete newEstimates[productId];
    setProductEstimates(newEstimates);
  };

  const updateProductEstimate = (productId: string, updates: Partial<ProductEstimate>) => {
    setProductEstimates({
      ...productEstimates,
      [productId]: {
        ...productEstimates[productId],
        ...updates,
      },
    });
  };

  const updateOriginCost = (productId: string, field: keyof OriginCost, value: number) => {
    const estimate = productEstimates[productId];
    if (estimate) {
      updateProductEstimate(productId, {
        originCost: {
          ...estimate.originCost,
          [field]: value,
        },
      });
    }
  };

  const updateLogisticsCost = (productId: string, field: keyof LogisticsCost, value: number) => {
    const estimate = productEstimates[productId];
    if (estimate) {
      updateProductEstimate(productId, {
        logisticsCost: {
          ...estimate.logisticsCost,
          [field]: value,
        },
      });
    }
  };

  const applyMarginToAll = () => {
    const updatedEstimates = { ...productEstimates };
    selectedProducts.forEach(productId => {
      if (updatedEstimates[productId]) {
        updatedEstimates[productId].margin = globalMargin;
      }
    });
    setProductEstimates(updatedEstimates);
    setApplyGlobalMargin(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const calculateTotalCost = () => {
    return selectedProducts.reduce((total, productId) => {
      const estimate = productEstimates[productId];
      if (estimate) {
        const pricing = calculatePricing(estimate);
        return total + pricing.importerCost;
      }
      return total;
    }, 0);
  };

  const calculateAverageMargin = () => {
    if (selectedProducts.length === 0) return 0;
    const totalMargin = selectedProducts.reduce((sum, productId) => {
      const estimate = productEstimates[productId];
      return sum + (estimate?.margin || 0);
    }, 0);
    return totalMargin / selectedProducts.length;
  };

  const handleSave = () => {
    if (!containerId.trim()) {
      alert('Please enter a Container ID');
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    const estimates = selectedProducts.map(productId => productEstimates[productId]);
    const totalCost = calculateTotalCost();
    const averageMargin = calculateAverageMargin();

    const estimate = {
      id: id || Date.now().toString(),
      containerId,
      date: new Date().toISOString(),
      products: estimates,
      totalCost,
      marginApplied: averageMargin,
      createdBy: user?.name || 'Unknown',
      role: currentRole,
    };

    if (id) {
      updateEstimate(id, estimate);
    } else {
      saveEstimate(estimate);
    }

    navigate('/estimates');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Estimate' : 'New Estimate for Grain Export'}
        </h1>
        <Button onClick={handleSave} icon={Save}>
          {id ? 'Update Estimate' : 'Save Estimate'}
        </Button>
      </div>

      {/* Container ID */}
      <Card title="Container Information">
        <Input
          label="Container ID"
          value={containerId}
          onChange={(e) => setContainerId(e.target.value)}
          placeholder="Enter container ID"
          required
        />
      </Card>

      {/* Product Selection */}
      <Card title="Product Selection">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCTS.map(product => (
              <div
                key={product.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedProducts.includes(product.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => 
                  selectedProducts.includes(product.id) 
                    ? removeProduct(product.id)
                    : addProduct(product.id)
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  {selectedProducts.includes(product.id) ? (
                    <X className="h-5 w-5 text-primary-600" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedProducts.length > 0 && (
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Input
                label="Global Margin %"
                type="number"
                value={globalMargin}
                onChange={(e) => setGlobalMargin(Number(e.target.value))}
                className="w-32"
                min={0}
                max={100}
              />
              <Button
                variant="outline"
                onClick={applyMarginToAll}
                className="mt-6"
              >
                Apply to All Products
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Product Estimates */}
      {selectedProducts.map(productId => {
        const product = PRODUCTS.find(p => p.id === productId);
        const estimate = productEstimates[productId];
        const pricing = estimate ? calculatePricing(estimate) : null;

        if (!product || !estimate) return null;

        return (
          <Card
            key={productId}
            title={product.name}
            subtitle={product.category}
            className="animate-slide-up"
          >
            <div className="space-y-6">
              {/* Origin Costs */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection(`origin-${productId}`)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900">Origin Procurement Costs</h3>
                  {expandedSections[`origin-${productId}`] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {expandedSections[`origin-${productId}`] && (
                  <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Raw Material Cost"
                      type="number"
                      value={estimate.originCost.rawMaterialCost}
                      onChange={(e) => updateOriginCost(productId, 'rawMaterialCost', Number(e.target.value))}
                      prefix="$"
                      min={0}
                      step={0.01}
                    />
                    <Input
                      label="Transport Cost"
                      type="number"
                      value={estimate.originCost.transportCost}
                      onChange={(e) => updateOriginCost(productId, 'transportCost', Number(e.target.value))}
                      prefix="$"
                      min={0}
                      step={0.01}
                    />
                    <Input
                      label="Packing Cost"
                      type="number"
                      value={estimate.originCost.packingCost}
                      onChange={(e) => updateOriginCost(productId, 'packingCost', Number(e.target.value))}
                      prefix="$"
                      min={0}
                      step={0.01}
                    />
                    <Input
                      label="Fumigation Cost"
                      type="number"
                      value={estimate.originCost.fumigationCost}
                      onChange={(e) => updateOriginCost(productId, 'fumigationCost', Number(e.target.value))}
                      prefix="$"
                      min={0}
                      step={0.01}
                    />
                    <Input
                      label="Customs Clearance Cost"
                      type="number"
                      value={estimate.originCost.customsClearanceCost}
                      onChange={(e) => updateOriginCost(productId, 'customsClearanceCost', Number(e.target.value))}
                      prefix="$"
                      min={0}
                      step={0.01}
                    />
                    <Input
                      label="Margin %"
                      type="number"
                      value={estimate.margin}
                      onChange={(e) => updateProductEstimate(productId, { margin: Number(e.target.value) })}
                      suffix="%"
                      min={0}
                      max={100}
                      step={0.1}
                    />
                  </div>
                )}
              </div>

              {/* Logistics Costs */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection(`logistics-${productId}`)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900">Logistics Cost at Destination</h3>
                  {expandedSections[`logistics-${productId}`] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {expandedSections[`logistics-${productId}`] && (
                  <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Freight Cost"
                      type="number"
                      value={estimate.logisticsCost.freightCost}
                      onChange={(e) => updateLogisticsCost(productId, 'freightCost', Number(e.target.value))}
                      prefix="$"
                      min={0}
                      step={0.01}
                    />
                    <Input
                      label="Import Duty"
                      type="number"
                      value={estimate.logisticsCost.importDuty}
                      onChange={(e) => updateLogisticsCost(productId, 'importDuty', Number(e.target.value))}
                      prefix="$"
                      min={0}
                      step={0.01}
                    />
                    <Input
                      label="Customs Clearance"
                      type="number"
                      value={estimate.logisticsCost.customsClearance}
                      onChange={(e) => updateLogisticsCost(productId, 'customsClearance', Number(e.target.value))}
                      prefix="$"
                      min={0}
                      step={0.01}
                    />
                    <Input
                      label="Transport to Final Destination"
                      type="number"
                      value={estimate.logisticsCost.transportToDestination}
                      onChange={(e) => updateLogisticsCost(productId, 'transportToDestination', Number(e.target.value))}
                      prefix="$"
                      min={0}
                      step={0.01}
                    />
                    <Input
                      label="Distributor Margin %"
                      type="number"
                      value={estimate.distributorMargin}
                      onChange={(e) => updateProductEstimate(productId, { distributorMargin: Number(e.target.value) })}
                      suffix="%"
                      min={0}
                      max={100}
                      step={0.1}
                    />
                    <Input
                      label="Retailer Margin %"
                      type="number"
                      value={estimate.retailerMargin}
                      onChange={(e) => updateProductEstimate(productId, { retailerMargin: Number(e.target.value) })}
                      suffix="%"
                      min={0}
                      max={100}
                      step={0.1}
                    />
                  </div>
                )}
              </div>

              {/* Pricing Summary */}
              {pricing && (
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Calculator className="h-5 w-5 mr-2 text-primary-600" />
                      Calculated Pricing
                    </h3>
                  </div>
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
              )}
            </div>
          </Card>
        );
      })}

      {/* Total Summary */}
      {selectedProducts.length > 0 && (
        <Card title="Estimate Summary" className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-primary-100 text-sm">Total Container Value</p>
              <p className="text-2xl font-bold">{formatCurrency(calculateTotalCost())}</p>
            </div>
            <div className="text-center">
              <p className="text-primary-100 text-sm">Products Selected</p>
              <p className="text-2xl font-bold">{selectedProducts.length}</p>
            </div>
            <div className="text-center">
              <p className="text-primary-100 text-sm">Average Margin</p>
              <p className="text-2xl font-bold">{calculateAverageMargin().toFixed(2)}%</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EstimateForm;