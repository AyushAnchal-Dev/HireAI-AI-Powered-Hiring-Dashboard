"use client"

import * as React from "react"

type ToastProps = {
    title?: string
    description?: string
    variant?: "default" | "destructive"
}

const ToastContext = React.createContext<{
    toast: (props: ToastProps) => void
}>({
    toast: () => { },
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastProps[]>([])

    const toast = (props: ToastProps) => {
        setToasts((prev) => [...prev, props])
        setTimeout(() => {
            setToasts((prev) => prev.slice(1))
        }, 3000)
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((t, i) => (
                    <div key={i} className={`p-4 rounded-xl border shadow-lg animate-in slide-in-from-right-full ${t.variant === 'destructive' ? 'bg-red-900/90 border-red-800 text-white' : 'bg-[#060B1A]/90 border-white/10 text-white'}`}>
                        {t.title && <div className="font-semibold">{t.title}</div>}
                        {t.description && <div className="text-sm text-gray-300">{t.description}</div>}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => React.useContext(ToastContext)
