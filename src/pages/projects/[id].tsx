// material-ui imports
import { Button, Grid, InputLabel, Stack, TextField, MenuItem, Select, FormControl } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';

// form validation
import { useFormik } from 'formik';
import * as yup from 'yup';

// hooks and API queries
import { useRouter } from 'next/router';
import { useDeleteProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation } from '../../store/reducers/projectsSlice';
import { useGetUsersQuery } from '../../store/reducers/usersSlice';
import Layout from 'layout';
import { ReactElement } from 'react';
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
  const isEditMode = Boolean(id); // Determines if we are in edit mode based on presence of `id`

  const { data: users } = useGetUsersQuery(); // Fetching users for the foreman dropdown
  const { data: projectData, isLoading } = useGetProjectByIdQuery(Number(id), { skip: !isEditMode }); // Fetch project details if in edit mode
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true, // Allow form to reinitialize when `initialValues` change
    initialValues: {
      name: projectData?.name || '',
      description: projectData?.description || '',
      status: projectData?.status || 'Not Started',
      assignedForeman: projectData?.assignedForeman?.id || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      await updateProject({ id, ...values });
      router.push('/projects'); // Redirect after saving the project
    }
  });

  if (isLoading || isDeleting) {
    return <div>Loading...</div>; // Show loading state if project details are being fetched
  }

  return (
    <MainCard title={isEditMode ? 'Edit Project' : 'Create Project'}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Project Name */}
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
                // helperText={formik.touched.name && formik.errors.name}
              />
            </Stack>
          </Grid>

          {/* Project Description */}
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
                // helperText={formik.touched.description && formik.errors.description}
              />
            </Stack>
          </Grid>

          {/* Project Status */}
          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
              <InputLabel>Status</InputLabel>
              <Select id="status" name="status" value={formik.values.status} onChange={formik.handleChange}>
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
              {/* <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText> */}
            </FormControl>
          </Grid>

          {/* Assigned Foreman */}
          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.assignedForeman && Boolean(formik.errors.assignedForeman)}>
              <InputLabel>Assigned Foreman</InputLabel>
              <Select id="assignedForeman" name="assignedForeman" value={formik.values.assignedForeman} onChange={formik.handleChange}>
                <MenuItem value="">Unassigned</MenuItem>
                {users?.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
              {/* <FormHelperText>{formik.touched.assignedForeman && formik.errors.assignedForeman}</FormHelperText> */}
            </FormControl>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <AlertDialog
                title="Are you sure you want to delete this project?"
                description="Deleting this project is permanent and cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={() => deleteProject(Number(id))}
                openButtonText="Delete Project"
              />
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
