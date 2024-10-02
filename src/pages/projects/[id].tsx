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

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true, // Allow form to reinitialize when `initialValues` change
    initialValues: {
      name: projectData?.name || '',
      description: projectData?.description || '',
      status: projectData?.status || 'Not Started',
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
    <MainCard title={isEditMode ? 'Edit Project' : 'Create Project'}>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="name">Project Name</InputLabel>
              <TextField
                fullWidth
                id="name"
                name="name"
                placeholder="Enter project name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
              />
              {formik.touched.name && formik.errors.name && <FormHelperText error={true}>{String(formik.errors.name)}</FormHelperText>}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="description">Description</InputLabel>
              <TextField
                fullWidth
                id="description"
                name="description"
                placeholder="Enter project description"
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
              <InputLabel>Status</InputLabel>
              <Select id="status" name="status" value={formik.values.status} onChange={formik.handleChange}>
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            {formik.touched.status && formik.errors.status && <FormHelperText error={true}>{String(formik.errors.status)}</FormHelperText>}
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.assignedForeman && Boolean(formik.errors.assignedForeman)}>
              <InputLabel>Assigned Foreman</InputLabel>
              <Select id="assignedForeman" name="assignedForeman" value={formik.values.assignedForeman} onChange={formik.handleChange}>
                <MenuItem value={-1}>Unassigned</MenuItem>
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
                  title="Are you sure you want to delete this project?"
                  description="Deleting this project is permanent and cannot be undone."
                  confirmText="Delete"
                  cancelText="Cancel"
                  onConfirm={handleProjectDelete}
                  openButtonText="Delete Project"
                />
              ) : (
                ''
              )}
              <AnimateButton>
                <Button variant="contained" type="submit">
                  {isEditMode ? 'Update Project' : 'Create Project'}
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
