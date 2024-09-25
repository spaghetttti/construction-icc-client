import { ReactElement } from 'react';
import { Typography } from '@mui/material';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import { useGetMaterialsQuery } from 'store/reducers/materialsSlice';
import Layout from 'layout';
import InventoryTable from 'sections/InvetoryTable';

const InventoryPage = () => {
  const { data: materials, error, isLoading } = useGetMaterialsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <Page title="Inventory">
      <MainCard title="Materials Inventory">
        <Typography variant="body2">
          <InventoryTable data={materials as any} />
        </Typography>
      </MainCard>
    </Page>
  );
};

InventoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default InventoryPage;
