'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Product } from '../../api/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { CATEGORY_OPTIONS } from './options';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'photo_url',
    header: 'Ảnh',
    cell: ({ row }) => {
      return (
        <div className='relative h-16 w-16 overflow-hidden rounded-lg border bg-muted/30'>
          <Image
            src={row.getValue('photo_url')}
            alt={row.getValue('name')}
            fill
            sizes='64px'
            className='rounded-lg object-cover'
          />
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên sản phẩm' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Product['name']>()}</div>,
    meta: {
      label: 'Tên sản phẩm',
      placeholder: 'Tìm sản phẩm...',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    id: 'category',
    accessorKey: 'category',
    enableSorting: false,
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title='Danh mục' />
    ),
    cell: ({ cell }) => {
      const category = cell.getValue<Product['category']>();
      const labels: Record<string, string> = {
        windows: 'Windows',
        office: 'Microsoft Office',
        combo: 'Combo ưu đãi'
      };

      return (
        <Badge variant='outline' className='capitalize'>
          {labels[category] ?? category}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Danh mục',
      variant: 'multiSelect',
      options: CATEGORY_OPTIONS
    }
  },
  {
    accessorKey: 'price',
    header: 'Giá'
  },
  {
    accessorKey: 'description',
    header: 'Mô tả'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
