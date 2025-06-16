import { ProductEstimate, CalculatedPricing } from '../types';
import { EXPORT_DUTY_RATE } from '../data/products';

export const calculatePricing = (estimate: ProductEstimate): CalculatedPricing => {
  const { originCost, logisticsCost, margin, distributorMargin, retailerMargin } = estimate;
  
  // Calculate total origin cost
  const totalOriginCost = 
    originCost.rawMaterialCost +
    originCost.transportCost +
    originCost.packingCost +
    originCost.fumigationCost +
    originCost.customsClearanceCost;

  // Calculate procurement cost with margin
  const procurementCost = totalOriginCost * (1 + margin / 100);
  
  // Calculate export duty based on procurement cost
  const exportDuty = procurementCost * EXPORT_DUTY_RATE;
  
  // Total procurement cost including export duty
  const finalProcurementCost = procurementCost + exportDuty;
  
  // Calculate total logistics cost
  const totalLogisticsCost = 
    logisticsCost.freightCost +
    logisticsCost.importDuty +
    logisticsCost.customsClearance +
    logisticsCost.transportToDestination;

  // Calculate importer cost
  const importerCost = finalProcurementCost + totalLogisticsCost;
  
  // Calculate distributor price
  const distributorPrice = importerCost * (1 + distributorMargin / 100);
  
  // Calculate retailer price
  const retailerPrice = distributorPrice * (1 + retailerMargin / 100);

  return {
    procurementCost: finalProcurementCost,
    importerCost,
    distributorPrice,
    retailerPrice,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const calculateTotalEstimate = (estimates: ProductEstimate[]): number => {
  return estimates.reduce((total, estimate) => {
    const pricing = calculatePricing(estimate);
    return total + pricing.importerCost;
  }, 0);
};