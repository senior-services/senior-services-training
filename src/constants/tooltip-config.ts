/**
 * Centralized tooltip configuration and design tokens
 */
export const TOOLTIP_CONFIG = {
  delayDuration: 300,
  skipDelayDuration: 100,
  disableHoverableContent: false,
} as const;

export const TOOLTIP_POSITIONS = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
} as const;

export type TooltipPosition = keyof typeof TOOLTIP_POSITIONS;