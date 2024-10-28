// material-ui imports
import { Button, Grid, InputLabel, Stack, TextField, MenuItem, Select, FormControl, Typography, FormHelperText } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';

// form validation
import { useFormik } from 'formik';
import * as yup from 'yup';

// hooks and API queries
import { useRouter } from 'next/router';
import {
  useAddProjectMutation,
  useDeleteProjectMutation,
  useGetProjectByIdQuery,
  useUpdateProjectMutation
} from '../../store/reducers/projectsSlice';
import { useGetUsersQuery } from '../../store/reducers/usersSlice';
import Layout from 'layout';
import { ReactElement, useState } from 'react';
import AlertDialog from 'components/AlertDialog';
import { useIntl } from 'react-intl';

// Yup validation schema for project form
const validationSchema = yup.object({
  name: yup.string().required('Project name is required'),
  description: yup.string().required('Project description is required'),
  status: yup.string().required('Status is required'),
  assignedForeman: yup.number().nullable()
});

const ProjectPage = () => {
  const router = useRouter();
  const { id } = router.query; // Extract project ID from the URL
  const isEditMode = Number(id); // Determines if we are in edit mode based on presence of `id`
  const { data: users } = useGetUsersQuery(); // Fetching users for the foreman dropdown
  const { data: projectData, isLoading } = useGetProjectByIdQuery(Number(id), { skip: !isEditMode }); // Fetch project details if in edit mode
  const [updateProject] = useUpdateProjectMutation();
  const [addProject] = useAddProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [error, setError] = useState<any>();
  const intl = useIntl();

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true, // Allow form to reinitialize when `initialValues` change
    initialValues: {
      name: projectData?.name || '',
      description: projectData?.description || '',
      status: projectData?.status || intl.formatMessage({ id: 'edit-project' }),
      assignedForeman: projectData?.assignedForeman?.id || 0
    },
    validationSchema,
    onSubmit: async (values) => {
      let result;
      if (isEditMode) result = await updateProject({ id, ...values });
      else result = await addProject(values);
      if ('error' in result) {
        setError((result.error as any).data.message);
      } else {
        router.push('/projects');
      }
    }
  });

  const handleProjectDelete = async () => {
    const result = await deleteProject(Number(id));
    if ('error' in result) {
      console.log(result.error);
      setError((result.error as any).data.message);
    } else {
      router.push('/projects');
    }
  };

  if (isLoading || isDeleting) {
    return <div>Loading...</div>; // Show loading state if project details are being fetched
  }

  return (
    <MainCard title={isEditMode ? intl.formatMessage({ id: 'edit-project' }) : intl.formatMessage({ id: 'create-project' })}>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="name">{intl.formatMessage({ id: 'project-name' })}</InputLabel>
              <TextField
                fullWidth
                id="name"
                name="name"
                placeholder={intl.formatMessage({ id: 'enter-project-name' })}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
              />
              {formik.touched.name && formik.errors.name && <FormHelperText error={true}>{String(formik.errors.name)}</FormHelperText>}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="description">{intl.formatMessage({ id: 'description' })}</InputLabel>
              <TextField
                fullWidth
                id="description"
                name="description"
                // placeholder={intl.formatMessage({ id: 'description' })}
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
              />
              {formik.touched.description && formik.errors.description && (
                <FormHelperText error={true}>{String(formik.errors.description)}</FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
              <InputLabel>{intl.formatMessage({ id: 'status' })}</InputLabel>
              <Select id="status" name="status" value={formik.values.status} onChange={formik.handleChange}>
                <MenuItem value="Not Started">{intl.formatMessage({ id: 'not-started' })}</MenuItem>
                <MenuItem value="In Progress">{intl.formatMessage({ id: 'in-progress' })}</MenuItem>
                <MenuItem value="Completed">{intl.formatMessage({ id: 'completed' })}</MenuItem>
              </Select>
            </FormControl>
            {formik.touched.status && formik.errors.status && <FormHelperText error={true}>{String(formik.errors.status)}</FormHelperText>}
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.assignedForeman && Boolean(formik.errors.assignedForeman)}>
              <InputLabel>{intl.formatMessage({ id: 'assigned-foreman' })}</InputLabel>
              <Select id="assignedForeman" name="assignedForeman" value={formik.values.assignedForeman} onChange={formik.handleChange}>
                <MenuItem value={-1}>{intl.formatMessage({ id: 'unassigned' })}</MenuItem>
                {users?.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              {isEditMode ? (
                <AlertDialog
                  title={intl.formatMessage({ id: 'are-you-sure-you-want-to-delete-this-project' })}
                  description={intl.formatMessage({ id: 'deleting-this-project-is-permanent-and-cannot-be-undone' })}
                  confirmText={intl.formatMessage({ id: 'delete' })}
                  cancelText={intl.formatMessage({ id: 'cancel' })}
                  onConfirm={handleProjectDelete}
                  openButtonText={intl.formatMessage({ id: 'delete-project' })}
                />
              ) : (
                ''
              )}
              <AnimateButton>
                <Button variant="contained" type="submit">
                  {isEditMode ? intl.formatMessage({ id: 'update-project' }) : intl.formatMessage({ id: 'create-project' })}
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

ProjectPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProjectPage;
