import { DollarCircleFilled } from '@ant-design/icons';
import { Box, Button, Typography } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import MainCard from 'components/MainCard';
import Page from 'components/Page';
import Layout from 'layout';
import { ReactElement } from 'react';
// import { FormattedMessage } from 'react-intl';
import ReportsTable from 'sections/ReportsTable';
import { useGetAccountingQuery, useGetReportsQuery } from 'store/reducers/accountingReportsSlice';
import { formatMoney } from 'utils/formatUtils';

const AccountingPage = () => {
  const { data: mainAccount, error, isLoading } = useGetAccountingQuery();
  const { data: reports, error: reportsError, isLoading: reportsIsLoading } = useGetReportsQuery();

  if (isLoading || reportsIsLoading) return <p>Loading...</p>;
  if (error || reportsError) return <p>Error loading users</p>;

  return (
    <Page title="">
      <MainCard title="">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
          <Typography variant="h3">Баланс: {formatMoney(mainAccount?.balance ?? 0)}</Typography>
          <AnimateButton>
            <Button variant="shadow" endIcon={<DollarCircleFilled />} href="accounting/new">
              {/* <FormattedMessage id="create-project" /> */}
              Записать Транзакцию
            </Button>
          </AnimateButton>
        </Box>

        <ReportsTable data={(reports as any) ?? []} />
      </MainCard>
    </Page>
  );
};

AccountingPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AccountingPage;
