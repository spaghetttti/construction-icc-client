import { useMemo } from 'react';

// material-ui
import { Stack, Button, Link } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { ReactTable } from 'components/ReactTable';
import { ExportOutlined } from '@ant-design/icons';
import { Project } from 'store/reducers/projectsSlice';
import { Material } from 'store/reducers/materialsSlice';
import AnimateButton from 'components/@extended/AnimateButton';
// import { CSVExport } from 'components/third-party/ReactTable';
// import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

// ==============================|| REACT TABLE - BASIC ||============================== //

const RequestsTable = ({ data, striped, title }: { data: []; striped?: boolean; title?: string }) => {
  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id'
      },
      {
        Header: 'Статус',
        accessor: 'status'
      },
      {
        Header: 'Размер Бригады',
        accessor: 'teamSize'
      },
      {
        Header: 'Проект',
        accessor: 'project',
        Cell: ({ value }: { value: Project }) => {
          return (
            <>
              <AnimateButton>
                <Button variant="shadow" size="small" component={Link} href="/" target="_blank">
                  {value?.name}
                  <ExportOutlined />
                </Button>
              </AnimateButton>
            </>
          );
        }
      },
      {
        Header: 'Материалы',
        accessor: 'materials',
        Cell: ({ value }: { value: Material[] }) => {
          return (
            <>
              {value?.map((material) => (
                <>{material.name}, </>
              ))}
            </>
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
        <ReactTable columns={columns} data={data} striped={striped} withLinks={true} />
      </ScrollX>
    </MainCard>
  );
};

export default RequestsTable;
