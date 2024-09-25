import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
// third-party
import { Column, useTable, HeaderGroup, Cell } from 'react-table';
// ==============================|| REACT TABLE ||============================== //

export function ReactTable({ columns, data, striped }: { columns: Column[]; data: []; striped?: boolean }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

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
            <TableRow {...row.getRowProps()} key={i}>
              {row.cells.map((cell: Cell<{}>, i: number) => (
                <TableCell {...cell.getCellProps([{ className: '' }])} key={i}>
                  {cell.render('Cell')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
