import type { Track } from '@/db/schema'
import { makeArtworkUrl } from '@/lib/utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Btns } from './btns'
const columnHelper = createColumnHelper<Track>()
const columns = [
  columnHelper.display({
    id: 'artwork',
    cell: (props) => (
      <img
        className="w-10 min-w-10"
        src={makeArtworkUrl(props.row.original.path)}
      />
    ),
  }),
  columnHelper.accessor('artist', {
    header: 'Artist',
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor('album', {
    header: 'Album',
    cell: (info) => <span>{info.getValue()}</span>,
  }),

  columnHelper.display({
    id: 'btns',
    cell: (props) => <Btns track={props.row.original} />,
  }),
]
export default function TrackTable({ tracks }: { tracks: Track[] }) {
  const table = useReactTable({
    columns,
    data: tracks,
    getCoreRowModel: getCoreRowModel(),
  })
  // console.log('tracks in table - ', tracks)

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 40,
  })

  return (
    <>
      <div ref={parentRef}>
        <Table style={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <>
                {virtualizer.getVirtualItems().map((virtualRow, index) => {
                  const row = table.getRowModel().rows[virtualRow.index]
                  if (!row) return null
                  return (
                    <TableRow
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${
                          virtualRow.start - index * virtualRow.size
                        }px)`,
                      }}
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
