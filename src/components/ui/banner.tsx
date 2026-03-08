import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"

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
      },
      size: {
        default: "banner-size-default",
        compact: "banner-size-compact",
        "compact-constrained": "banner-size-compact-constrained",
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
    const iconSize = size === "compact-constrained" ? "h-3.5 w-3.5 shrink-0" : size === "compact" ? "h-4 w-4 shrink-0" : "h-5 w-5 shrink-0"

    const renderBody = () => (
      <>
        {description && <div className="font-normal [&_p]:leading-relaxed opacity-90">{description}</div>}
        {children && <div className="font-medium [&_p]:leading-relaxed">{children}</div>}
        {actions && <div className="mt-3 flex items-center space-x-2">{actions}</div>}
      </>
    )

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(bannerVariants({ variant, size }), className)}
        {...props}
      >
        <div className={cn("flex justify-between", title ? "items-start" : "items-center")}>
          <div className={cn("flex gap-2.5 flex-1", title ? "items-start" : "items-center")}>
            {showIcon && IconComp ? (
              <IconComp className={iconSize} />
            ) : null}
            <div className="flex-1 min-w-0">
              {title && (
                <h5 className={cn("font-semibold leading-tight tracking-tight", (description || children || actions) && "mb-1.5")}>{title}</h5>
              )}
              {renderBody()}
            </div>
          </div>
          {dismissible && (
            <button
              type="button"
              className="h-6 w-6 p-0 inline-flex items-center justify-center rounded-sm opacity-70 hover:opacity-100 transition-opacity ml-2"
              onClick={onDismiss}
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    )
  }
)
Banner.displayName = "Banner"

export { Banner, bannerVariants }
