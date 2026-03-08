import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-float group-[.toaster]:border-border",
          title: "group-[.toast]:!hidden",
          description: "group-[.toast]:!text-sm group-[.toast]:!text-foreground group-[.toast]:!opacity-100",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:border-[hsl(var(--success-border))] group-[.toaster]:bg-[hsl(var(--success-bg))] [&_[data-icon]]:text-success",
          warning:
            "group-[.toaster]:border-[hsl(var(--warning-border))] group-[.toaster]:bg-[hsl(var(--warning-bg))] [&_[data-icon]]:text-warning",
          info:
            "group-[.toaster]:border-[hsl(var(--primary-border))] group-[.toaster]:bg-[hsl(var(--primary-bg))] [&_[data-icon]]:text-primary",
        },
        duration: 4000,
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
