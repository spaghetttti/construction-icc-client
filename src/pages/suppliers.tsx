import { ReactElement } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import { useGetSuppliersQuery } from 'store/reducers/suppliersSlice';
import SuppliersTable from 'sections/SuppliersTable';

// ==============================|| Users List PAGE ||============================== //

const SuppliersPage = () => {
  const { data: suppliers, error, isLoading } = useGetSuppliersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <Page title="">
      <MainCard title="">
        <Typography variant="body2">
          <SuppliersTable data={suppliers as any} />
        </Typography>
      </MainCard>
    </Page>
  );
};

SuppliersPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SuppliersPage;
