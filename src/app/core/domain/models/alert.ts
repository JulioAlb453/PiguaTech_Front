export type AlertLevel = 'info' |'warning' | 'critical'

export interface Alert {
    id: string
    timestamp: Date
    level: AlertLevel
    message: string
    source: string
    isRead: boolean // para saber si el usuario ha visto la alerta
}
