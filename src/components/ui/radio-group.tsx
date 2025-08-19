import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Carbon Design System Radio Button - 20px container, 1px border, fully circular
        "relative h-5 w-5 rounded-full border border-foreground bg-transparent shrink-0",
        "hover:border-primary transition-colors duration-200 ease-out",
        // Focus: 2px border as per Carbon spec (using border instead of ring for consistency)
        "focus-visible:outline-none focus-visible:border-2 focus-visible:border-primary",
        // Selected state: border becomes primary, inner dot appears
        "data-[state=checked]:border-primary",
        // Disabled states
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:border-muted-foreground",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
        {/* Carbon Design System: 8px inner dot with primary color */}
        <div className="h-2 w-2 rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }