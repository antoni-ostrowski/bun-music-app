import SidebarLeft from '@/components/sidebar-left'
import SidebarRight from '@/components/sidebar-right'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider>
      <SidebarLeft />

      <SidebarInset>
        <div className="border border-red-500">
          TEST INSERT <Outlet />
        </div>
      </SidebarInset>
      <SidebarRight />
      <TanStackRouterDevtools />
    </SidebarProvider>
  ),
})
