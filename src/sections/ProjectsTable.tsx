import { useMemo } from 'react';

// material-ui
import { Chip, Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { User } from 'store/reducers/usersSlice';
import { ReactTable } from 'components/ReactTable';
// import { CSVExport } from 'components/third-party/ReactTable';
// import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

// ==============================|| REACT TABLE - BASIC ||============================== //

const ProjectsTable = ({ data, striped, title }: { data: []; striped?: boolean; title?: string }) => {
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
        <ReactTable columns={columns} data={data} striped={striped} withLinks={true} />
      </ScrollX>
    </MainCard>
  );
};

export default ProjectsTable;
