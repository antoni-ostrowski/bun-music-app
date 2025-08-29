import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export default function SidebarLeft() {
  return (
    <Sidebar
      className="sticky top-0 h-svh border border-blue-500 lg:flex"
      collapsible="none"
    >
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <p>test</p>
        <div className="flex gap-2 p-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{' '}
          <Link to="/settings" className="[&.active]:font-bold">
            Settings
          </Link>{' '}
        </div>
        <hr />
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
