import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

const bannerVariants = cva(
  "banner-base",
  {
    variants: {
      variant: {
        default: "banner-default",
        info: "banner-info",
        information: "banner-information",
        success: "banner-success",
        warning: "banner-warning",
        error: "banner-error",
        destructive: "banner-destructive",
        attention: "banner-attention",
      },
      size: {
        default: "banner-size-default",
        compact: "banner-size-compact",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const iconMap = {
  info: Info,
  information: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  destructive: XCircle,
  attention: AlertTriangle,
  default: Info,
}

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  title?: string
  description?: string
  icon?: React.ElementType<{ className?: string }>
  showIcon?: boolean
  dismissible?: boolean
  onDismiss?: () => void
  actions?: React.ReactNode
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default",
    title, 
    description, 
    icon: CustomIcon, 
    showIcon = true, 
    dismissible = false, 
    onDismiss, 
    actions, 
    children, 
    ...props 
  }, ref) => {
    const IconComp = (CustomIcon || iconMap[variant as keyof typeof iconMap] || iconMap.default) as React.ElementType<{ className?: string }>
    const iconClass = size === "compact" ? "h-4 w-4 mt-0.5 shrink-0" : "h-5 w-5 mt-0.5 shrink-0"

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(bannerVariants({ variant, size }), className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {showIcon && IconComp ? (
              <IconComp className={iconClass} />
            ) : null}
            <div className="flex-1 min-w-0">
              {title && (
                <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>
              )}
              {description && (
                <div className="[&_p]:leading-relaxed opacity-90">{description}</div>
              )}
              {children && (
                <div className="[&_p]:leading-relaxed">{children}</div>
              )}
              {actions && (
                <div className="mt-3 flex items-center space-x-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
              onClick={onDismiss}
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }
)
Banner.displayName = "Banner"

export { Banner, bannerVariants }