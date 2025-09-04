import SidebarLeft from '@/components/sidebar/sidebar-left'
import SidebarRight from '@/components/sidebar/sidebar-right'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import type { AppRouter } from '@/trpc'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'

export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>
  queryClient: QueryClient
}
export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className={`flex min-h-screen flex-col`}>
        <div className={`flex items-center gap-2 border-b`}>
          {/* Show a global spinner when the router is transitioning */}
          {/*<div
            className={`text-3xl opacity-0 delay-0 duration-300 ${
              isFetching ? `opacity-40 duration-1000` : ''
            }`}
          >
            loading...
          </div>*/}
          <div className={`flex-1 border-l border-gray-200`}>
            {/* Render our first route match */}
            <SidebarProvider>
              <SidebarLeft />

              <SidebarInset>
                <Outlet />
                <Toaster />
              </SidebarInset>
              <SidebarRight />
            </SidebarProvider>
          </div>
        </div>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </>
  )
}
