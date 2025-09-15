import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TOOLTIP_CONFIG, type TooltipPosition } from "@/constants/tooltip-config";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";

interface IconButtonWithTooltipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  position?: TooltipPosition;
  ariaLabel?: string;
  asChild?: boolean;
}

/**
 * Unified IconButtonWithTooltip component with accessibility best practices
 * Optimized with React.memo for performance
 */
export const IconButtonWithTooltip = React.memo(
  React.forwardRef<HTMLButtonElement, IconButtonWithTooltipProps>(
    (
      {
        icon: Icon,
        tooltip,
        variant = "ghost",
        size = "sm",
        position = "top",
        ariaLabel,
        className,
        onClick,
        ...props
      },
      ref
    ) => {
      // Optimize click handler with useCallback pattern
      const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
        },
        [onClick]
      );

      return (
        <Tooltip delayDuration={TOOLTIP_CONFIG.delayDuration}>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              variant={variant}
              size={size}
              className={cn(className)}
              onClick={handleClick}
              aria-label={ariaLabel || tooltip}
              {...props}
            >
              <Icon className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={position}>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    }
  )
);

IconButtonWithTooltip.displayName = "IconButtonWithTooltip";