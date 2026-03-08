import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

const alertVariants = cva(
  "alert-base",
  {
    variants: {
      variant: {
        info: "alert-info",
        success: "alert-success",
        warning: "alert-warning",
        error: "alert-error",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
  description?: string
  icon?: React.ElementType<{ className?: string }>
  showIcon?: boolean
  onDismiss?: () => void
  actions?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({
    className,
    variant = "info",
    title,
    description,
    icon: CustomIcon,
    showIcon = true,
    onDismiss,
    actions,
    children,
    ...props
  }, ref) => {
    const IconComp = (CustomIcon || iconMap[variant as keyof typeof iconMap] || iconMap.info) as React.ElementType<{ className?: string }>

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-2.5 flex-1">
            {showIcon && IconComp ? (
              <IconComp className={cn("h-5 w-5 shrink-0 text-on-color", !title && "mt-px")} />
            ) : null}
            <div className="flex-1 min-w-0">
              {title && (
                <h5 className={cn("font-semibold leading-tight tracking-tight text-on-color", (description || children || actions) && "mb-1.5")}>{title}</h5>
              )}
              {description && (
                <div className="text-on-color/90 [&_p]:leading-relaxed">{description}</div>
              )}
              {children && (
                <div className="text-on-color/90 [&_p]:leading-relaxed">{children}</div>
              )}
              {actions && (
                <div className="mt-3 flex items-center space-x-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-on-color hover:text-on-color hover:bg-on-color/10"
              onClick={onDismiss}
              aria-label="Dismiss alert"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          )}
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert, alertVariants }
