interface NotificationProps {
  cta?: React.ReactNode
  icon: React.ReactNode
  title: string
}

export function Notification({
  children,
  cta,
  icon,
  title,
}: React.PropsWithChildren & NotificationProps) {
  return (
    <div className="NotificationWrapper">
      <div className="Notification">
        <div className="Notification__icon">{icon}</div>
        <div className="Notification__title">{title}</div>
        <div className="Notification__message">{children}</div>
        {cta && <div className="Notification__cta">{cta}</div>}
      </div>
    </div>
  )
}
