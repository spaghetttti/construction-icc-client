import { ReactElement } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import Layout from 'layout';
import { useGetRequestsQuery } from 'store/reducers/requestsSlice';
import RequestsTable from 'sections/RequestsTable';
import { FileAddOutlined } from '@ant-design/icons';
import AnimateButton from 'components/@extended/AnimateButton';
import { useIntl } from 'react-intl';

const InventoryPage = () => {
  const { data: requests, error, isLoading } = useGetRequestsQuery();
  const intl = useIntl();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <Page title="Inventory">
      <MainCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
          <Typography variant="h3">Лист заявок</Typography>
          <AnimateButton>
            <Button variant="shadow" endIcon={<FileAddOutlined />} href="requests/new">
              {intl.formatMessage({ id: 'create-request' })}
            </Button>
          </AnimateButton>
        </Box>
        <RequestsTable data={requests as any} />
      </MainCard>
    </Page>
  );
};

InventoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default InventoryPage;
