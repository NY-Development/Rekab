import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  PaginationState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  searchPlaceholder?: string;
  onSearchChange?: (search: string) => void;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = 1,
  onPaginationChange,
  searchPlaceholder = 'Search...',
  onSearchChange,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchValue, setSearchValue] = useState('');

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      const nextState = typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(nextState);
      onPaginationChange?.(nextState);
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange?.(searchValue);
    }
  };

  return (
    <div className="space-y-4">
      {onSearchChange && (
        <div className="flex items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            className="max-w-sm bg-slate-900 border-slate-700 text-white"
          />
          <Button
            variant="secondary"
            onClick={() => onSearchChange(searchValue)}
            className="text-xs"
          >
            Search
          </Button>
        </div>
      )}
      <div className="rounded-md border border-slate-800 bg-slate-950 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900 border-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-slate-800 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-slate-400 font-semibold h-11">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={`border-slate-800 hover:bg-slate-900/50 ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-slate-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="text-xs text-slate-500">
          Page {pagination.pageIndex + 1} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-slate-800 text-slate-400 hover:bg-slate-900"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-slate-800 text-slate-400 hover:bg-slate-900"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
