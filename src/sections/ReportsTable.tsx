import { useMemo } from 'react';

// material-ui
import { Button, Chip, Link, Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { ReactTable } from 'components/ReactTable';
import AnimateButton from 'components/@extended/AnimateButton';
import { Project } from 'store/reducers/projectsSlice';
import { ExportOutlined } from '@ant-design/icons';
import { formatISODate, formatMoney } from 'utils/formatUtils';
// import { CSVExport } from 'components/third-party/ReactTable';
// import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

// ==============================|| REACT TABLE - BASIC ||============================== //

const ReportsTable = ({ data, striped, title }: { data: []; striped?: boolean; title?: string }) => {
  console.log(data);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id'
      },
      {
        Header: 'Описание',
        accessor: 'description'
      },
      {
        Header: 'Тип',
        accessor: 'type',
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case 'income':
              return <Chip color="success" label="Доход" size="small" variant="light" />;
            case 'outcome':
              return <Chip color="error" label="Расход" size="small" variant="light" />;
            default:
              return <Chip color="info" label={value} size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Сумма',
        accessor: 'amount',
        Cell: ({ value }: { value: any }) => {
          return <>{formatMoney(value)}</>;
        }
      },
      {
        Header: 'Дата',
        accessor: 'dateOfTransaction',
        Cell: ({ value }: { value: string }) => {
          return <>{formatISODate(value)}</>;
        }
      },
      {
        Header: 'Пользователь',
        accessor: 'person',
        Cell: ({ value }: { value: any }) => {
          if (!value) return <>-</>;
          return <>{value?.username}</>;
        }
      },
      {
        Header: 'Внешний',
        accessor: 'externalPerson',
        Cell: ({ value }: { value: string }) => {
          if (!value) return <>-</>;
          return <>{value}</>;
        }
      },
      {
        Header: 'Проект',
        accessor: 'project',
        Cell: ({ value }: { value: Project }) => {
          if (!value) return <>-</>;
          return (
            <AnimateButton>
              <Button variant="shadow" size="small" component={Link} href="/" target="_blank">
                {value?.name}
                <ExportOutlined />
              </Button>
            </AnimateButton>
          );
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
        <ReactTable columns={columns} data={data} striped={striped} withLinks={false} />
      </ScrollX>
    </MainCard>
  );
};

export default ReportsTable;
