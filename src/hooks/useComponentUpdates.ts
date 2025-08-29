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
import { useToast } from '@/hooks/use-toast';

interface ComponentUpdateHook {
  trackUpdate: (component: ComponentName, changes: string[]) => Promise<void>;
  validateComponent: (component: ComponentName) => Promise<void>;
  validateAllComponents: () => Promise<void>;
  getRecentUpdates: () => ReturnType<typeof componentTracker.getRecentUpdates>;
  isValidating: boolean;
}

export const useComponentUpdates = (): ComponentUpdateHook => {
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const trackUpdate = async (component: ComponentName, changes: string[]) => {
    setIsValidating(true);
    
    try {
      // Track the update
      const update = trackComponentUpdate(component, changes);
      
      // Validate the component health
      const health = await getComponentHealth(component);
      
      // Show success toast with summary
      toast({
        title: `✅ ${component} component updated`,
        description: `Updated in ${update.affectedAreas.length} areas: ${update.affectedAreas.slice(0, 3).join(', ')}${update.affectedAreas.length > 3 ? '...' : ''}`,
        variant: "success",
      });

      // Show warnings if any
      if (health.issues.length > 0) {
        toast({
          title: `⚠️ Issues detected in ${component}`,
          description: health.issues.join(', '),
          variant: "destructive",
        });
      }

      // Show recommendations if any
      if (health.recommendations.length > 0) {
        toast({
          title: `💡 Recommendations for ${component}`,
          description: health.recommendations[0], // Show first recommendation
        });
      }

    } catch (error) {
      console.error('Error tracking component update:', error);
      toast({
        title: `❌ Error updating ${component}`,
        description: 'Failed to track component update',
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const validateComponent = async (component: ComponentName) => {
    setIsValidating(true);
    
    try {
      const health = await getComponentHealth(component);
      
      if (health.isHealthy) {
        toast({
          title: `✅ ${component} is healthy`,
          description: `No issues found in component structure`,
          variant: "success",
        });
      } else {
        toast({
          title: `⚠️ Issues found in ${component}`,
          description: `${health.issues.length} issues detected`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error validating component:', error);
      toast({
        title: `❌ Validation failed`,
        description: `Could not validate ${component}`,
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const validateAll = async () => {
    setIsValidating(true);
    
    try {
      const results = await validateAllComponents();
      
      toast({
        title: `📊 Component Health Report`,
        description: `${results.healthyComponents}/${results.totalComponents} components healthy`,
        variant: results.healthyComponents === results.totalComponents ? "success" : "default",
      });

      if (results.unhealthyComponents.length > 0) {
        console.log('Unhealthy components:', results.unhealthyComponents);
      }
      
    } catch (error) {
      console.error('Error validating all components:', error);
      toast({
        title: `❌ Validation failed`,
        description: 'Could not validate components',
        variant: "destructive",
      });
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
  };
};