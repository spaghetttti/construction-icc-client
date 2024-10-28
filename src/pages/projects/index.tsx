import { ReactElement } from 'react';

// material-ui
import { Box, Button, Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import { useGetProjectsQuery } from 'store/reducers/projectsSlice';
import ProjectsTable from 'sections/ProjectsTable';
import AnimateButton from 'components/@extended/AnimateButton';
import { FormattedMessage } from 'react-intl';
import { FileAddOutlined } from '@ant-design/icons';

// ==============================|| Users List PAGE ||============================== //

const ProjectsPage = () => {
  const { data: projects, error, isLoading } = useGetProjectsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <Page title="">
      <MainCard title="">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
          <Typography variant="h3">Лист проектов</Typography>
          <AnimateButton>
            <Button variant="shadow" endIcon={<FileAddOutlined />} href="projects/new">
              <FormattedMessage id="create-project" />
            </Button>
          </AnimateButton>
        </Box>
        <ProjectsTable data={projects as any} />
      </MainCard>
    </Page>
  );
};

ProjectsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProjectsPage;
