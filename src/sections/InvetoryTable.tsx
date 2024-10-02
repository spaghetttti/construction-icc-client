import { useMemo } from 'react';

// material-ui
import { Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { User } from 'store/reducers/usersSlice';
import { ReactTable } from 'components/ReactTable';
// import { CSVExport } from 'components/third-party/ReactTable';
// import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

// ==============================|| REACT TABLE - BASIC ||============================== //

const InventoryTable = ({ data, striped, title }: { data: []; striped?: boolean; title?: string }) => {
  console.log(data);
  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id'
      },
      {
        Header: 'Название',
        accessor: 'name'
      },
      {
        Header: 'Вид',
        accessor: 'type'
      },
      {
        Header: 'Eдиница',
        accessor: 'unit'
      },
      {
        Header: 'Цена за единицу',
        accessor: 'costPerUnit'
      },
      {
        Header: 'Количество',
        accessor: 'quantity'
      },
      {
        Header: 'Поставщик',
        accessor: 'supplier',
        Cell: ({ value }: { value: User }) => {
          return <>{value?.name}</>;
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

export default InventoryTable;
