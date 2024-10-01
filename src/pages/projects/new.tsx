// material-ui imports
import { Button, Grid, InputLabel, Stack, TextField, MenuItem, Select, FormControl, FormHelperText } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';

// form validation
import { useFormik } from 'formik';
import * as yup from 'yup';

// hooks and API queries
import { useRouter } from 'next/router';
import { useGetUsersQuery } from '../../store/reducers/usersSlice';
import { useAddProjectMutation } from '../../store/reducers/projectsSlice';
import { ReactElement } from 'react';
import Layout from 'layout';

// Yup validation schema for new project form
const validationSchema = yup.object({
  name: yup.string().required('Project name is required'),
  description: yup.string().required('Project description is required'),
  status: yup.string().required('Status is required'),
  assignedForeman: yup.number().nullable(),
});

const NewProjectPage = () => {
  const router = useRouter();
  const { data: users } = useGetUsersQuery(); // Fetching users for the foreman dropdown
  const [addProject] = useAddProjectMutation();

  // Initial form values for a new project
  const initialValues = {
    name: '',
    description: '',
    status: 'Not Started',
    assignedForeman: '',
  };

  // Formik setup for handling form submission
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await addProject(values);
      router.push('/projects'); // Redirect to the projects page after project creation
    },
  });

  return (
    <MainCard title="Create New Project">
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
                helperText={formik.touched.name && formik.errors.name}
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
                helperText={formik.touched.description && formik.errors.description}
              />
            </Stack>
          </Grid>

          {/* Project Status */}
          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
              <InputLabel>Status</InputLabel>
              <Select
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
              <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Assigned Foreman */}
          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.assignedForeman && Boolean(formik.errors.assignedForeman)}>
              <InputLabel>Assigned Foreman</InputLabel>
              <Select
                id="assignedForeman"
                name="assignedForeman"
                value={formik.values.assignedForeman}
                onChange={formik.handleChange}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {users?.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{formik.touched.assignedForeman && formik.errors.assignedForeman}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" type="submit">
                  Create Project
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

NewProjectPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewProjectPage;
