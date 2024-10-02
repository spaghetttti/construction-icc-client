import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Column, useTable, HeaderGroup, Cell } from 'react-table';
// ==============================|| REACT TABLE ||============================== //

export function ReactTable({
  columns,
  data,
  striped,
  withLinks = true
}: {
  columns: Column[];
  data: [];
  striped?: boolean;
  withLinks?: boolean;
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });
  const router = useRouter();

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup: HeaderGroup<{}>, index: number) => (
          <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup.headers.map((column: HeaderGroup<{}>, i: number) => (
              <TableCell {...column.getHeaderProps([{ className: '' }])} key={i}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()} {...(striped && { className: 'striped' })}>
        {rows.map((row, i) => {
          prepareRow(row);
          // implement withLinks = false
          return (
            <Link href={`${router.asPath}/${row.values.id}`}>
              <TableRow {...row.getRowProps()} key={i}>
                {row.cells.map((cell: Cell<{}>, i: number) => {
                  return (
                    <TableCell {...cell.getCellProps([{ className: '' }])} key={i}>
                      {cell.render('Cell')}
                    </TableCell>
                  );
                })}
              </TableRow>
            </Link>
          );
        })}
      </TableBody>
    </Table>
  );
}
