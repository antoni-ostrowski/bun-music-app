import PageTitleWrapper, {
  pageTitleIconSize,
} from '@/components/page-title-wrapper'
import LibraryManagment from '@/components/settings/library-managment/library-managment'
import MusicSources from '@/components/settings/music-sources.tsx/music-sources'
import { createFileRoute } from '@tanstack/react-router'
import { Settings } from 'lucide-react'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageTitleWrapper
      title="Settings"
      description="Manage your music library and preferences"
      icon={<Settings className={pageTitleIconSize} />}
    >
      <div className="space-y-6">
        <MusicSources />
        <LibraryManagment />
      </div>
    </PageTitleWrapper>
  )
}
