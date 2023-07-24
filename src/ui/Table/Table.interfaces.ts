import { ReactNode } from 'react';

export type CellValue = string | number | null | undefined;
export interface TableRow {
  id: string | number;
  [key: string]: CellValue;
}

export interface TableProps {
  rows: TableRow[];
  columns: string[];
  sortedColumns?: string[];
  pagination?: Pagination;
  searchParams?: SearchParams;
  renderCell?: (columnName: string, value: CellValue, row: TableRow) => CellValue | JSX.Element;
  renderHeaderCell?: (name: string) => CellValue;
  className?: {
    headerCell?: (column: string) => string;
    cell?: (column: string) => string;
    row?: (row: TableRow) => string;
  };
  summary?: (currentData: TableRow[]) => ReactNode;
}

export interface TableHeaderProps {
  children: JSX.Element[];
}

export interface TableBodyProps {
  children: JSX.Element;
}

export interface TableRowProps {
  className?: string;
  children: JSX.Element[];
}

export interface TableHeaderCellProps {
  className?: string;
  children: CellValue | JSX.Element;
}

export interface TableCellProps {
  className?: string;
  children: CellValue | JSX.Element;
}

export interface Pagination {
  rowsPerPage: number;
}

export interface SearchParams {
  column: string;
  placeholder?: string;
}

export type SortDirection = 'ascending' | 'descending';

export type SortOrder = Record<string, SortDirection>;
