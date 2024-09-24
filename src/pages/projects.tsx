import { ReactElement } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import { useGetProjectsQuery } from 'store/reducers/projectsSlice';
import ProjectsTable from 'sections/ProjectsTable';

// ==============================|| Users List PAGE ||============================== //

const ProjectsPage = () => {
  const { data: projects, error, isLoading } = useGetProjectsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <Page title="">
      <MainCard title="">
        <Typography variant="body2">
          <ProjectsTable data={projects as any} />
        </Typography>
      </MainCard>
    </Page>
  );
};

ProjectsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProjectsPage;
