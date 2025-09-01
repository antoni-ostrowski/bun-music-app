import type { ReactNode } from 'react'
export const pageTitleIconSize = 'h-8 w-8'
export default function PageTitleWrapper({
  title,
  icon,
  description,
  children,
}: {
  title: string
  icon: ReactNode
  description: string
  children: ReactNode
}) {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="">{icon}</div>
          {/*<Settings className="text-primary h-8 w-8" />*/}
          <div>
            <h1 className="text-foreground text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">
              {description}
              {/*Manage your music library and preferences*/}
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
