import { ReactElement } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import { useGetMaterialsQuery } from 'store/reducers/materialsSlice';
import Layout from 'layout';
import InventoryTable from 'sections/InvetoryTable';
import AnimateButton from 'components/@extended/AnimateButton';
import { FileAddOutlined } from '@ant-design/icons';

const InventoryPage = () => {
  const { data: materials, error, isLoading } = useGetMaterialsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <Page title="Inventory">
      <MainCard title="Materials Inventory">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
          <Typography variant="h3">Лист материалов</Typography>
          <AnimateButton>
            <Button variant="shadow" endIcon={<FileAddOutlined />} href="inventory/new">
              Добавить материал
            </Button>
          </AnimateButton>
        </Box>
        <InventoryTable data={materials as any} />
      </MainCard>
    </Page>
  );
};

InventoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default InventoryPage;
