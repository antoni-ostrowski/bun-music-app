import Player from '@/app/player/components/player'
import { Sidebar, SidebarContent } from '@/components/ui/sidebar'

export default function SidebarRight() {
  return (
    <Sidebar className="sticky top-0 h-svh w-[30vw] lg:flex" collapsible="none">
      <SidebarContent>
        <Player />
      </SidebarContent>
    </Sidebar>
  )
}
