import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RefreshCw } from 'lucide-react'
import ManualTracksSync from './manual-sync'

export default function LibraryManagment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Library Management
        </CardTitle>
        <CardDescription>Manage your library settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <ManualTracksSync />
      </CardContent>
    </Card>
  )
}
