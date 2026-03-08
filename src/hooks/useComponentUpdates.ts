/**
 * React Hook for Component Update Tracking
 * Provides real-time tracking and validation of component changes
 */

import { useEffect, useState } from 'react';
import { 
  ComponentName, 
  componentTracker, 
  trackComponentUpdate, 
  getComponentHealth,
  validateAllComponents 
} from '@/utils/componentUpdates';
import { toast } from 'sonner';

interface ComponentUpdateHook {
  trackUpdate: (component: ComponentName, changes: string[]) => Promise<void>;
  validateComponent: (component: ComponentName) => Promise<void>;
  validateAllComponents: () => Promise<void>;
  getRecentUpdates: () => ReturnType<typeof componentTracker.getRecentUpdates>;
  isValidating: boolean;
  error: string | null;
}

export const useComponentUpdates = (): ComponentUpdateHook => {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackUpdate = async (component: ComponentName, changes: string[]) => {
    setIsValidating(true);
    setError(null);

    try {
      // Track the update
      const update = trackComponentUpdate(component, changes);
      
      // Validate the component health
      const health = await getComponentHealth(component);
      
      // Show success toast with summary
      toast.success(`${component} component updated`, {
        description: `Updated in ${update.affectedAreas.length} areas: ${update.affectedAreas.slice(0, 3).join(', ')}${update.affectedAreas.length > 3 ? '...' : ''}`,
      });

      // Show warnings if any
      if (health.issues.length > 0) {
        toast.warning(`Issues detected in ${component}`, {
          description: health.issues.join(', '),
        });
      }

      // Show recommendations if any
      if (health.recommendations.length > 0) {
        toast.info(`Recommendations for ${component}`, {
          description: health.recommendations[0],
        });
      }

    } catch (error) {
      console.error('Error tracking component update:', error);
      setError(`Failed to track component update for ${component}`);
    } finally {
      setIsValidating(false);
    }
  };

  const validateComponent = async (component: ComponentName) => {
    setIsValidating(true);
    setError(null);

    try {
      const health = await getComponentHealth(component);

      if (health.isHealthy) {
        toast.success(`${component} is healthy`, {
          description: `No issues found in component structure`,
        });
      } else {
        toast.warning(`Issues found in ${component}`, {
          description: `${health.issues.length} issues detected`,
        });
      }
    } catch (error) {
      console.error('Error validating component:', error);
      setError(`Could not validate ${component}`);
    } finally {
      setIsValidating(false);
    }
  };

  const validateAll = async () => {
    setIsValidating(true);
    setError(null);

    try {
      const results = await validateAllComponents();
      
      if (results.healthyComponents === results.totalComponents) {
        toast.success('Component Health Report', {
          description: `${results.healthyComponents}/${results.totalComponents} components healthy`,
        });
      } else {
        toast.info('Component Health Report', {
          description: `${results.healthyComponents}/${results.totalComponents} components healthy`,
        });
      }

      
    } catch (error) {
      console.error('Error validating all components:', error);
      setError('Could not validate components');
    } finally {
      setIsValidating(false);
    }
  };

  const getRecentUpdates = () => {
    return componentTracker.getRecentUpdates();
  };

  return {
    trackUpdate,
    validateComponent,
    validateAllComponents: validateAll,
    getRecentUpdates,
    isValidating,
    error,
  };
};