"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

// Simple column type that matches usage in the app
export interface Column<T> {
  key: string
  header: string
  cell: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  sortColumn?: string
  sortDirection?: "asc" | "desc"
  onSort?: (column: string) => void
  emptyMessage?: string
}

// Helper to convert simple columns to tanstack format
function convertColumns<T>(columns: Column<T>[]): ColumnDef<T, any>[] {
  return columns.map(col => ({
    id: col.key,
    header: col.header,
    cell: ({ row }) => col.cell(row.original),
  }))
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  totalCount,
  page,
  pageSize,
  onPageChange,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  const tanstackColumns = convertColumns(columns)
  
  const table = useReactTable({
    data,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = Math.ceil(totalCount / pageSize)
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalCount)

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
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
                  key={keyExtractor(row.original)}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startItem} to {endItem} of {totalCount} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
