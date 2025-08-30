import type { Track } from '@/db/schema'
import { makeArtworkUrl } from '@/lib/utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
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
      <img className="w-10" src={makeArtworkUrl(props.row.original.path)} />
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
  console.log('tracks in table - ', tracks)
  return (
    <>
      <div>
        <Table>
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
              table.getRowModel().rows.map((row) => (
                <TableRow
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
              ))
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
