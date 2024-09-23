import { ReactElement } from 'react';

// material-ui
import { Grid, Slide, Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import useUser from 'hooks/useUser';
import { FormattedMessage } from 'react-intl';
import UserCard from 'sections/UserCard';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => {
  const user = useUser();
  const fakeUser = {
    id: 2,
    firstName: 'test',
    lastName: 'test',
    email: 'test',
    age: 22,
    role: 'test',
    visits: 33,
    progress: 11,
    status: 'test',
    orderStatus: 'test',
    contact: 11111111,
    country: 'test',
    address: 'test',
    fatherName: 'test',
    about: 'test',
    avatar: 1,
    skills: ['test'],
    time: 'test'
  };
  console.log(user);

  return (
    <Page title="">
      <MainCard title="Sample Card">
        <Typography variant="body2">
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((el: number) => (
              <Slide key={el} direction="up" in={true} timeout={50}>
                <Grid item xs={12} sm={6} lg={4}>
                  <UserCard customer={fakeUser} />
                </Grid>
              </Slide>
            ))}
          </Grid>
          <FormattedMessage id="account-profile" />
        </Typography>
      </MainCard>
    </Page>
  );
};
SamplePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SamplePage;
