'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useDataTable } from '@/hooks/use-data-table';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { useSuspenseQuery } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { getSortingStateParser } from '@/lib/parsers';
import { productsQueryOptions } from '../../api/queries';
import { columns } from './columns';
import { CATEGORY_OPTIONS } from './options';
import { Columns3, Search, X } from 'lucide-react';
import * as React from 'react';

const columnIds = columns.map((c) => c.id).filter(Boolean) as string[];

export function ProductTable() {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    name: parseAsString,
    category: parseAsString,
    sort: getSortingStateParser(columnIds).withDefault([])
  });
  const [searchValue, setSearchValue] = React.useState(params.name ?? '');

  const updateSearch = useDebouncedCallback((value: string) => {
    void setParams({ name: value.trim() || null, page: 1 });
  }, 400);

  const filters = {
    page: params.page,
    limit: params.perPage,
    ...(params.name && { search: params.name }),
    ...(params.category && { categories: params.category }),
    ...(params.sort.length > 0 && { sort: JSON.stringify(params.sort) })
  };

  const { data } = useSuspenseQuery(productsQueryOptions(filters));

  const pageCount = Math.ceil(data.total_products / params.perPage);

  const { table } = useDataTable({
    data: data.products,
    columns,
    pageCount,
    shallow: true,
    debounceMs: 500,
    initialState: {
      columnPinning: { right: ['actions'] }
    }
  });

  const hideableColumns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()),
    [table]
  );

  const resetFilters = () => {
    setSearchValue('');
    updateSearch('');
    void setParams({ name: null, category: null, page: 1 });
  };

  return (
    <DataTable table={table}>
      <div className='flex w-full flex-col gap-3 p-1 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center'>
          <div className='relative w-full sm:max-w-sm'>
            <Search
              aria-hidden='true'
              className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
            />
            <Input
              type='search'
              aria-label='Tìm sản phẩm'
              placeholder='Tìm sản phẩm...'
              value={searchValue}
              onChange={(event) => {
                const value = event.target.value;
                setSearchValue(value);
                updateSearch(value);
              }}
              className='h-9 pl-9 focus-visible:border-blue-500 focus-visible:ring-blue-500/20'
            />
          </div>

          <select
            aria-label='Lọc theo danh mục'
            value={params.category ?? ''}
            onChange={(event) => {
              void setParams({ category: event.target.value || null, page: 1 });
            }}
            className='border-input bg-background h-9 w-full rounded-md border px-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-52'
          >
            <option value=''>Tất cả danh mục</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {(searchValue || params.category) && (
            <Button type='button' variant='outline' size='sm' onClick={resetFilters}>
              <X aria-hidden='true' />
              Xóa lọc
            </Button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='focus-visible:border-blue-500 focus-visible:ring-blue-500/20'
            >
              <Columns3 aria-hidden='true' />
              Cột hiển thị
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuLabel>Hiện/ẩn cột</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {hideableColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(checked) => column.toggleVisibility(Boolean(checked))}
                onSelect={(event) => event.preventDefault()}
              >
                {column.columnDef.meta?.label ?? column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </DataTable>
  );
}
