import { ReactElement } from 'react';

// material-ui
import { Box, Button, Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import { useGetSuppliersQuery } from 'store/reducers/suppliersSlice';
import SuppliersTable from 'sections/SuppliersTable';
import AnimateButton from 'components/@extended/AnimateButton';
import { FileAddOutlined } from '@ant-design/icons';

// ==============================|| Users List PAGE ||============================== //

const SuppliersPage = () => {
  const { data: suppliers, error, isLoading } = useGetSuppliersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <Page title="">
      <MainCard title="">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
          <Typography variant="h3">Лист поставщиков</Typography>
          <AnimateButton>
            <Button variant="shadow" endIcon={<FileAddOutlined />} href="suppliers/new">
              Добавить нового поствщика
            </Button>
          </AnimateButton>
        </Box>

        <SuppliersTable data={suppliers as any} />
      </MainCard>
    </Page>
  );
};

SuppliersPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SuppliersPage;
