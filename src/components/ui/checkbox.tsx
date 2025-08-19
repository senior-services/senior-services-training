import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Carbon Design System Checkbox - 16px container, clean minimal design
      "peer h-4 w-4 shrink-0 rounded-sm border border-foreground bg-transparent",
      "hover:border-primary transition-colors duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:border-muted-foreground",
      "disabled:data-[state=checked]:bg-muted-foreground disabled:data-[state=indeterminate]:bg-muted-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {/* Carbon Design System: Clean checkmark and indeterminate states */}
      <Check className="h-3 w-3 data-[state=indeterminate]:hidden" />
      <Minus className="h-3 w-3 data-[state=checked]:hidden" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
