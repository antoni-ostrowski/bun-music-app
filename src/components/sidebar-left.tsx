import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Minimize, Settings } from 'lucide-react'
const iconSize = 40

export default function SidebarLeft() {
  return (
    <Sidebar className="sticky top-0 h-svh border lg:flex" collapsible="none">
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuButton>
            <Minimize size={iconSize} />
            <Link to="/">
              <SidebarItemText text="Start" />
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton>
            <Settings size={iconSize} />
            <Link to="/settings">
              <SidebarItemText text="Settings" />
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
function SidebarItemText({ text }: { text: string }) {
  return <h1 className="text-md font-semibold">{text}</h1>
}
