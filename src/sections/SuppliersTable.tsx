import { useMemo } from 'react';

// material-ui
import { Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { ReactTable } from 'components/ReactTable';
// import { CSVExport } from 'components/third-party/ReactTable';
// import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

// ==============================|| REACT TABLE - BASIC ||============================== //

const SuppliersTable = ({ data, striped, title }: { data: []; striped?: boolean; title?: string }) => {
  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id'
      },
      {
        Header: 'Имя / Название магазина',
        accessor: 'name'
      },
      {
        Header: 'Адресс',
        accessor: 'address'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Номера телефонов',
        accessor: 'contactInfo',
        Cell: ({ value }: { value: any }) => {
          return <>{value.join(', ')}</>;
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
        <ReactTable columns={columns} data={data} striped={striped} withLinks={true} />
      </ScrollX>
    </MainCard>
  );
};

export default SuppliersTable;
