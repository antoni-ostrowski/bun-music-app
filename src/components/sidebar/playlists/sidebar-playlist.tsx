import { trpc } from '@/app/router'
import SpinnerLoading from '@/components/spinner-loading'
import { Button } from '@/components/ui/button'
import { SidebarMenuButton, SidebarMenuSub } from '@/components/ui/sidebar'
import { makeImageUrl } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronDown, List, ListVideo } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../ui/collapsible'
import { sidebarIconSize, SidebarItemText } from '../sidebar-left'
import AllPlaylists from './all-playlists'
import { NewPlaylist } from './new-playlist'

export default function SidebarPlaylists() {
  const { data, isError, isLoading } = useQuery(
    trpc.playlist.listPlaylists.queryOptions()
  )
  console.log('data - ', data)
  if (isError) {
    console.log('[PLAYLIST] Error gettings playlists')
    return null
  }

  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex w-full cursor-pointer items-center justify-start">
            <ListVideo size={sidebarIconSize - 10} />
            <SidebarItemText text="Playlists" />
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="gap-1">
            <AllPlaylists />
            <NewPlaylist />
            <Collapsible>
              <CollapsibleTrigger asChild className="w-full">
                <Button
                  className="flex w-full items-center justify-start"
                  variant={'ghost'}
                >
                  <List size={sidebarIconSize} />
                  <SidebarItemText text="My Playlists" />
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {isLoading && <SpinnerLoading />}
                  {data &&
                    !isLoading &&
                    data.map((playlist) => {
                      return (
                        <Link
                          to={`/playlist/$playlistId`}
                          params={{ playlistId: playlist.id }}
                          key={`sidebar-playlist-${playlist.id}`}
                        >
                          <Button
                            className="flex w-full items-center justify-start"
                            variant={'ghost'}
                            asChild
                          >
                            <div>
                              {playlist.cover_path && (
                                <img
                                  className="w-6"
                                  src={makeImageUrl(playlist.cover_path)}
                                />
                              )}
                              <p>{playlist.name}</p>
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
    </>
  )
}
