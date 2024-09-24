import { ReactElement } from 'react';

// material-ui
import { Grid, Slide, Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import UserCard from 'sections/UserCard';
import { useGetUsersQuery, User } from 'store/reducers/usersSlice';

// ==============================|| Users List PAGE ||============================== //

const UsersList = () => {
  const { data: users, error, isLoading } = useGetUsersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <Page title="">
      <MainCard title="">
        <Typography variant="body2">
          <Grid container spacing={3}>
            {users?.map((user: User) => {
              let fakeUser = {
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
              fakeUser.id = user.id;
              fakeUser.firstName = user.username;
              fakeUser.lastName = user.username;
              fakeUser.role = user.role;
              console.log(fakeUser);
              return (
                <Slide key={user.id} direction="up" in={true} timeout={50}>
                  <Grid item xs={12} sm={6} lg={4}>
                    <UserCard customer={fakeUser} />
                  </Grid>
                </Slide>
              );
            })}
          </Grid>
        </Typography>
      </MainCard>
    </Page>
  );
};

UsersList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default UsersList;
