interface TooltipContext {
  name?: string;
  status?: string;
  isPending?: boolean;
}

/**
 * Utility function for generating dynamic, context-aware tooltip text
 * Future: integrate with i18n system
 */
export const getTooltipText = (action: string, context?: TooltipContext): string => {
  switch (action) {
    case 'delete-employee':
      return context?.name ? `Delete ${context.name}` : 'Delete employee';
    
    case 'remove-admin':
      if (context?.isPending) {
        return 'Cancel invitation';
      }
      return context?.name ? `Remove ${context.name}` : 'Remove admin';
    
    case 'remove-file':
      return 'Remove selected file';
    
    case 'edit-item':
      return context?.name ? `Edit ${context.name}` : 'Edit item';
    
    case 'delete-item':
      return context?.name ? `Delete ${context.name}` : 'Delete item';
    
    case 'assign-videos':
      return context?.name ? `Assign videos to ${context.name}` : 'Assign videos';
    
    default:
      return action;
  }
};