import { createElement, ReactElement } from 'react';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import { Grid, Link, Typography, useTheme } from '@mui/material';
import pages from 'menu-items/pages';
import { NavItemType } from 'types/menu';

export default function HomePage() {
  const theme = useTheme();

  return (
    <Page title="Landing">
      <MainCard>
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          <Grid item xs={12} sx={{ mb: -2.25 }}>
            <Typography variant="h5">Панель страниц</Typography>
          </Grid>
          {pages.children?.map((page: NavItemType) => {
            const Icon = page?.icon;
            return (
              <Grid key={page.id} item xs={12} sm={6} md={4} lg={3}>
                <Link style={{ textDecoration: 'none' }} href={page.url}>
                  <MainCard border={false} boxShadow shadow={theme.customShadows.z1} sx={{ height: '100%' }}>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }} variant="h5">
                      {createElement(Icon as React.ElementType, { style: { paddingRight: 3 } })}
                      {page.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {page.info}
                    </Typography>
                  </MainCard>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </MainCard>
    </Page>
  );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
