import { ReactElement } from 'react';
import { Typography } from '@mui/material';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import Layout from 'layout';
import { useGetRequestsQuery } from 'store/reducers/requestsSlice';
import RequestsTable from 'sections/RequestsTable';

const InventoryPage = () => {
  const { data: requests, error, isLoading } = useGetRequestsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <Page title="Inventory">
      <MainCard title="Materials Inventory">
        <Typography variant="body2">
          <RequestsTable data={requests as any} />
        </Typography>
      </MainCard>
    </Page>
  );
};

InventoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default InventoryPage;
