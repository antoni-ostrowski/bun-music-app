import { SidebarMenuButton } from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { sidebarIconSize, SidebarItemText } from '../sidebar-left'

export default function FavTracks() {
  return (
    <>
      <SidebarMenuButton>
        <Star size={sidebarIconSize} color="yellow" fill="yellow" />
        <Link to="/favourite-tracks">
          <SidebarItemText text="Favourite Tracks" />
        </Link>
      </SidebarMenuButton>
    </>
  )
}
