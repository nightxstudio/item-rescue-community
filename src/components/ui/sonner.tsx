
import { useTheme } from "@/context/ThemeContext"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      expand={true}
      position="top-center"
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg animate-in slide-in-from-top-5 zoom-in-95 duration-300",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:animate-in fade-in-75 duration-300",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:animate-in fade-in-75 duration-300",
          success: "group-[.toast]:border-l-4 group-[.toast]:border-l-green-500 group-[.toast]:animate-in slide-in-from-right-1/4 duration-300",
          error: "group-[.toast]:border-l-4 group-[.toast]:border-l-red-500 group-[.toast]:animate-in slide-in-from-right-1/4 duration-300",
          info: "group-[.toast]:border-l-4 group-[.toast]:border-l-blue-500 group-[.toast]:animate-in slide-in-from-right-1/4 duration-300",
          loading: "group-[.toast]:animate-pulse",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, Sonner }
