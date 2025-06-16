import { useState, useEffect } from 'react';
import { Estimate } from '../types';

export const useEstimates = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);

  useEffect(() => {
    const storedEstimates = localStorage.getItem('estimates');
    if (storedEstimates) {
      setEstimates(JSON.parse(storedEstimates));
    }
  }, []);

  const saveEstimate = (estimate: Estimate) => {
    const updatedEstimates = [...estimates, estimate];
    setEstimates(updatedEstimates);
    localStorage.setItem('estimates', JSON.stringify(updatedEstimates));
  };

  const updateEstimate = (id: string, updatedEstimate: Estimate) => {
    const updatedEstimates = estimates.map(est => 
      est.id === id ? updatedEstimate : est
    );
    setEstimates(updatedEstimates);
    localStorage.setItem('estimates', JSON.stringify(updatedEstimates));
  };

  const deleteEstimate = (id: string) => {
    const updatedEstimates = estimates.filter(est => est.id !== id);
    setEstimates(updatedEstimates);
    localStorage.setItem('estimates', JSON.stringify(updatedEstimates));
  };

  const getEstimate = (id: string) => {
    return estimates.find(est => est.id === id);
  };

  return {
    estimates,
    saveEstimate,
    updateEstimate,
    deleteEstimate,
    getEstimate,
  };
};