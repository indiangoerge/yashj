export interface Product {
  id: string;
  name: string;
  category: string;
}

export interface OriginCost {
  rawMaterialCost: number;
  transportCost: number;
  packingCost: number;
  fumigationCost: number;
  customsClearanceCost: number;
  exportDuty: number; // Auto-calculated
}

export interface LogisticsCost {
  freightCost: number;
  importDuty: number;
  customsClearance: number;
  transportToDestination: number;
}

export interface ProductEstimate {
  productId: string;
  originCost: OriginCost;
  logisticsCost: LogisticsCost;
  margin: number;
  distributorMargin: number;
  retailerMargin: number;
}

export interface Estimate {
  id: string;
  containerId: string;
  date: string;
  products: ProductEstimate[];
  totalCost: number;
  marginApplied: number;
  createdBy: string;
  role: UserRole;
}

export interface CalculatedPricing {
  procurementCost: number;
  importerCost: number;
  distributorPrice: number;
  retailerPrice: number;
}

export type UserRole = 'admin' | 'ops-analyst';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}