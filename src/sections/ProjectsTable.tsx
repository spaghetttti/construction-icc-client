import { useMemo } from 'react';

// material-ui
import { Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// third-party
import { Column, useTable, HeaderGroup, Cell } from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { User } from 'store/reducers/usersSlice';
// import { CSVExport } from 'components/third-party/ReactTable';
// import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, striped }: { columns: Column[]; data: []; striped?: boolean }) {
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

// ==============================|| REACT TABLE - BASIC ||============================== //

const ProjectsTable = ({ data, striped, title }: { data: []; striped?: boolean; title?: string }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Название',
        accessor: 'name'
      },
      {
        Header: 'Описание',
        accessor: 'description'
      },
      {
        Header: 'Статус',
        accessor: 'status',
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case 'Complicated':
              return <Chip color="error" label="Complicated" size="small" variant="light" />;
            case 'Relationship':
              return <Chip color="success" label="Relationship" size="small" variant="light" />;
            case 'Single':
            default:
              return <Chip color="info" label={value} size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Прораб',
        accessor: 'assignedForeman',
        Cell: ({ value }: { value: User }) => {
          return <>{value?.username}</>;
        }
      }
    ],
    []
  );

  return (
    <MainCard
      content={false}
      title={title}
      // secondary={<CSVExport data={data.slice(0, 10)} filename={striped ? 'striped-table.csv' : 'basic-table.csv'} />}
    >
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}></Stack>
      <ScrollX>
        <ReactTable columns={columns} data={data} striped={striped} />
      </ScrollX>
    </MainCard>
  );
};

export default ProjectsTable;
