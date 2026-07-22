"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"

import { FoundationIcon } from "../icons.js"

type AfoTheme = "dark" | "light"

function readTheme(): AfoTheme {
  return document.documentElement.dataset.afoTheme === "light" ? "light" : "dark"
}

function Toaster(props: ToasterProps) {
  const [theme, setTheme] = useState<AfoTheme>("dark")

  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => setTheme(readTheme())
    const observer = new MutationObserver(syncTheme)

    syncTheme()
    observer.observe(root, { attributes: true, attributeFilter: ["data-afo-theme"] })
    return () => observer.disconnect()
  }, [])

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <FoundationIcon name="success" size="sm" decorative />,
        info: <FoundationIcon name="info" size="sm" decorative />,
        warning: <FoundationIcon name="warning" size="sm" decorative />,
        error: <FoundationIcon name="error" size="sm" decorative />,
        loading: <FoundationIcon name="loading" size="sm" decorative className="animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--afo-radius-card)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
export type { ToasterProps }
