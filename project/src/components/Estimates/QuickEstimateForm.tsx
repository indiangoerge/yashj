import React, { useState, useEffect } from 'react';
import { Calculator, Save, Copy } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { formatCurrency } from '../../utils/calculations';

interface QuickEstimateItem {
  id: string;
  containerNumber: string;
  pricePerUnit: number;
  margin: number;
  invoicePrice: number;
  useGlobalMargin: boolean;
}

const QuickEstimateForm: React.FC = () => {
  const [globalMargin, setGlobalMargin] = useState(10);
  const [applyGlobalMargin, setApplyGlobalMargin] = useState(false);
  const [items, setItems] = useState<QuickEstimateItem[]>([
    { id: '1', containerNumber: 'Rice A', pricePerUnit: 400, margin: 10, invoicePrice: 440, useGlobalMargin: false },
    { id: '2', containerNumber: 'Rice B', pricePerUnit: 450, margin: 10, invoicePrice: 495, useGlobalMargin: true },
    { id: '3', containerNumber: 'Millets C', pricePerUnit: 480, margin: 12, invoicePrice: 537.60, useGlobalMargin: false },
    { id: '4', containerNumber: 'Pulses D', pricePerUnit: 500, margin: 10, invoicePrice: 550, useGlobalMargin: false },
    { id: '5', containerNumber: 'Oils E', pricePerUnit: 700, margin: 10, invoicePrice: 770, useGlobalMargin: false },
  ]);

  const calculateInvoicePrice = (pricePerUnit: number, margin: number): number => {
    return pricePerUnit * (1 + margin / 100);
  };

  const updateItem = (id: string, field: keyof QuickEstimateItem, value: any) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalculate invoice price when price or margin changes
          if (field === 'pricePerUnit' || field === 'margin') {
            const effectiveMargin = updatedItem.useGlobalMargin ? globalMargin : updatedItem.margin;
            updatedItem.invoicePrice = calculateInvoicePrice(updatedItem.pricePerUnit, effectiveMargin);
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const toggleGlobalMargin = (id: string) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const useGlobal = !item.useGlobalMargin;
          const effectiveMargin = useGlobal ? globalMargin : item.margin;
          return {
            ...item,
            useGlobalMargin: useGlobal,
            invoicePrice: calculateInvoicePrice(item.pricePerUnit, effectiveMargin)
          };
        }
        return item;
      })
    );
  };

  const applyGlobalMarginToAll = () => {
    setItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        margin: globalMargin,
        useGlobalMargin: true,
        invoicePrice: calculateInvoicePrice(item.pricePerUnit, globalMargin)
      }))
    );
    setApplyGlobalMargin(false);
  };

  // Update items when global margin changes
  useEffect(() => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.useGlobalMargin) {
          return {
            ...item,
            invoicePrice: calculateInvoicePrice(item.pricePerUnit, globalMargin)
          };
        }
        return item;
      })
    );
  }, [globalMargin]);

  const duplicateSection = () => {
    const duplicatedItems = items.map(item => ({
      ...item,
      id: `${item.id}_copy_${Date.now()}`,
    }));
    setItems([...items, ...duplicatedItems]);
  };

  const getTotalInvoiceValue = () => {
    return items.reduce((total, item) => total + item.invoicePrice, 0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quick Price Estimation</h1>
          <p className="text-gray-600 mt-1">Fast pricing calculations with margin analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={duplicateSection} icon={Copy} variant="outline">
            Duplicate Section
          </Button>
          <Button icon={Save}>
            Save Estimate
          </Button>
        </div>
      </div>

      {/* Global Margin Control */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              label="Global Margin (%)"
              type="number"
              value={globalMargin}
              onChange={(e) => setGlobalMargin(Number(e.target.value))}
              className="w-32"
              min={0}
              max={100}
              step={0.1}
              suffix="%"
            />
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="applyGlobal"
                checked={applyGlobalMargin}
                onChange={(e) => setApplyGlobalMargin(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="applyGlobal" className="text-sm text-gray-700">
                Apply Same Margin
              </label>
            </div>
          </div>
          {applyGlobalMargin && (
            <Button onClick={applyGlobalMarginToAll} variant="outline">
              Apply to All
            </Button>
          )}
        </div>
      </Card>

      {/* Price Estimation Table */}
      <Card title="Price Estimation">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 font-medium text-gray-700">
              <div>Container Number</div>
              <div>Price per Unit</div>
              <div>Margin (%)</div>
              <div>Invoice Price</div>
            </div>

            {/* Data Rows */}
            <div className="space-y-4 pt-4">
              {items.slice(0, 5).map((item) => (
                <div key={item.id} className="grid grid-cols-4 gap-4 items-center">
                  <Input
                    value={item.containerNumber}
                    onChange={(e) => updateItem(item.id, 'containerNumber', e.target.value)}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={item.pricePerUnit}
                    onChange={(e) => updateItem(item.id, 'pricePerUnit', Number(e.target.value))}
                    min={0}
                    step={0.01}
                    className="w-full"
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={item.useGlobalMargin ? globalMargin : item.margin}
                      onChange={(e) => updateItem(item.id, 'margin', Number(e.target.value))}
                      min={0}
                      max={100}
                      step={0.1}
                      disabled={item.useGlobalMargin}
                      className="w-20"
                    />
                    <input
                      type="checkbox"
                      checked={item.useGlobalMargin}
                      onChange={() => toggleGlobalMargin(item.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      title="Use global margin"
                    />
                  </div>
                  <div className="bg-gray-50 px-3 py-2 rounded-lg font-medium text-gray-900">
                    {item.invoicePrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Cost Analysis Section */}
      {items.length > 5 && (
        <Card title="Cost Analysis">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header */}
              <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 font-medium text-gray-700">
                <div>Container Number</div>
                <div>Price per Unit</div>
                <div>Margin (%)</div>
                <div>Invoice Price</div>
              </div>

              {/* Data Rows */}
              <div className="space-y-4 pt-4">
                {items.slice(5).map((item) => (
                  <div key={item.id} className="grid grid-cols-4 gap-4 items-center">
                    <Input
                      value={item.containerNumber}
                      onChange={(e) => updateItem(item.id, 'containerNumber', e.target.value)}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      value={item.pricePerUnit}
                      onChange={(e) => updateItem(item.id, 'pricePerUnit', Number(e.target.value))}
                      min={0}
                      step={0.01}
                      className="w-full"
                    />
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={item.useGlobalMargin ? globalMargin : item.margin}
                        onChange={(e) => updateItem(item.id, 'margin', Number(e.target.value))}
                        min={0}
                        max={100}
                        step={0.1}
                        disabled={item.useGlobalMargin}
                        className="w-20"
                      />
                      <input
                        type="checkbox"
                        checked={item.useGlobalMargin}
                        onChange={() => toggleGlobalMargin(item.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        title="Use global margin"
                      />
                    </div>
                    <div className="bg-gray-50 px-3 py-2 rounded-lg font-medium text-gray-900">
                      {item.invoicePrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Summary */}
      <Card title="Estimation Summary" className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-primary-100 text-sm">Total Items</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div className="text-center">
            <p className="text-primary-100 text-sm">Total Invoice Value</p>
            <p className="text-2xl font-bold">{formatCurrency(getTotalInvoiceValue())}</p>
          </div>
          <div className="text-center">
            <p className="text-primary-100 text-sm">Average Margin</p>
            <p className="text-2xl font-bold">
              {(items.reduce((sum, item) => sum + (item.useGlobalMargin ? globalMargin : item.margin), 0) / items.length).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickEstimateForm;