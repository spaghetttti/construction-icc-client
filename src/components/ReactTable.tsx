import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useRouter } from 'next/router';

import { Column, useTable, HeaderGroup, Cell } from 'react-table';
// ==============================|| REACT TABLE ||============================== //

export function ReactTable({
  columns,
  data,
  striped,
  withLinks = false
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

  const handleRowClick = (id: number) => {
    if (withLinks) {
      router.push(`${router.asPath}/${id}`);
    }
  };

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
          return (
            <TableRow
              {...row.getRowProps()}
              key={i}
              onClick={() => handleRowClick(row.values.id)} // Add click event here
              style={{
                cursor: withLinks ? 'pointer' : 'default', // Show pointer cursor if clickable
                backgroundColor: striped && i % 2 ? '#f9f9f9' : 'inherit' // Add striped effect
              }}
            >
              {row.cells.map((cell: Cell<{}>, i: number) => {
                return (
                  <TableCell {...cell.getCellProps([{ className: '' }])} key={i}>
                    {cell.render('Cell')}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
