import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Minimize, Settings } from 'lucide-react'
import SidebarArtists from './artists/sidebar-artists'
import FavTracks from './fav-tracks/fav-tracks'
import SidebarPlaylists from './playlists/sidebar-playlist'
export const sidebarIconSize = 40

export default function SidebarLeft() {
  return (
    <Sidebar className="sticky top-0 h-svh lg:flex" collapsible="none">
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuButton>
            <Minimize size={sidebarIconSize} />
            <Link to="/">
              <SidebarItemText text="Start" />
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton>
            <Settings size={sidebarIconSize} />
            <Link to="/settings">
              <SidebarItemText text="Settings" />
            </Link>
          </SidebarMenuButton>
          <FavTracks />
          <SidebarPlaylists />
          <SidebarArtists />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
export function SidebarItemText({ text }: { text: string }) {
  return <h1 className="text-md font-semibold">{text}</h1>
}
