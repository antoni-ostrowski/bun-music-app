import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar'

export default function SidebarRight() {
  return (
    <Sidebar
      className="sticky top-0 h-svh w-[30vw] border border-blue-500 lg:flex"
      collapsible="none"
    >
      <SidebarHeader className="border-sidebar-border h-16 border-b"></SidebarHeader>
      <SidebarContent>
        <p>here player</p>
        <SidebarSeparator className="mx-0" />
        <p>player player player</p>
      </SidebarContent>
    </Sidebar>
  )
}
