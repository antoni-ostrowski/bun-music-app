import { trpc } from '@/app/router'
import SpinnerLoading from '@/components/spinner-loading'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { SidebarMenuButton, SidebarMenuSub } from '@/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronDown, User, Users } from 'lucide-react'
import { sidebarIconSize, SidebarItemText } from '../sidebar-left'
import AllArtists from './all-artists'

export default function SidebarArtists() {
  const { data, isLoading } = useQuery(trpc.metadata.listArtists.queryOptions())
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="cursor-pointer">
          <Users size={sidebarIconSize} />
          <SidebarItemText text="Artists" />
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub className="gap-1">
          <AllArtists />
          <Collapsible>
            <CollapsibleTrigger asChild className="w-full">
              <Button
                className="flex w-full items-center justify-start"
                variant={'ghost'}
              >
                <Users size={sidebarIconSize} />
                <SidebarItemText text="Artists" />
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {isLoading && <SpinnerLoading />}
                {data &&
                  !isLoading &&
                  data.map((artist) => {
                    return (
                      <Link
                        to={`/artist/$artist`}
                        params={{ artist: artist.artist }}
                        key={`sidebar-playlist-${crypto.randomUUID()}`}
                      >
                        <Button
                          className="flex w-full items-center justify-start"
                          variant={'ghost'}
                          asChild
                        >
                          <div>
                            <User size={sidebarIconSize} />
                            <p>{artist.artist}</p>
                          </div>
                        </Button>
                      </Link>
                    )
                  })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}
