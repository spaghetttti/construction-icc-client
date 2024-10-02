import { Button, Grid, InputLabel, Stack, TextField, Typography, FormHelperText, Box, Chip, MenuItem, Select } from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Layout from 'layout';
import { ReactElement, useState } from 'react';
import {
  useAddRequestMutation,
  useUpdateRequestMutation,
  useGetRequestByIdQuery,
  useDeleteRequestMutation
} from 'store/reducers/requestsSlice';
import { useGetProjectsQuery } from 'store/reducers/projectsSlice';
import { useGetMaterialsQuery } from 'store/reducers/materialsSlice';
import AlertDialog from 'components/AlertDialog';

// Form validation schema
const validationSchema = yup.object({
  status: yup.string().required('Status is required'),
  teamSize: yup.number().required('Team size is required'),
  projectId: yup.number().required('Project is required'),
  materialIds: yup.array().of(yup.number()).required('At least one material is required')
});

const RequestPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = Number(id);

  const { data: requestData, isLoading } = useGetRequestByIdQuery(Number(id), { skip: !isEditMode });
  const { data: projects } = useGetProjectsQuery();
  const { data: materials } = useGetMaterialsQuery();

  const [updateRequest] = useUpdateRequestMutation();
  const [addRequest] = useAddRequestMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteRequestMutation();
  const [error, setError] = useState<string | null>(null);
  const [, setSelectedMaterials] = useState<number[]>([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: requestData?.status || '',
      teamSize: requestData?.teamSize || 0,
      projectId: requestData?.project?.id || '',
      materialIds: requestData?.materials?.map((material) => material.id) || []
    },
    validationSchema,
    onSubmit: async (values) => {
      let result;
      if (isEditMode) {
        result = await updateRequest({ id: Number(id), ...values });
      } else {
        result = await addRequest(values);
      }

      if ('error' in result) {
        setError((result.error as any).data.message);
      } else {
        router.push('/requests');
      }
    }
  });

  const handleDeleteRequest = async () => {
    const result = await deleteRequest(Number(id));
    if ('error' in result) {
      setError((result.error as any).data.message);
    } else {
      router.push('/requests');
    }
  };

  const handleMaterialsChange = (event: any) => {
    setSelectedMaterials(event.target.value);
    formik.setFieldValue('materialIds', event.target.value);
  };

  if (isLoading || isDeleting) {
    return <div>Loading...</div>;
  }

  return (
    <MainCard title={isEditMode ? 'Edit Request' : 'Create Request'}>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="status">Request Status</InputLabel>
              <TextField
                fullWidth
                id="status"
                name="status"
                placeholder="Enter request status"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
              />
              {formik.touched.status && formik.errors.status && <FormHelperText error={true}>{formik.errors.status}</FormHelperText>}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="teamSize">Team Size</InputLabel>
              <TextField
                fullWidth
                id="teamSize"
                name="teamSize"
                placeholder="Enter team size"
                type="number"
                value={formik.values.teamSize}
                onChange={formik.handleChange}
                error={formik.touched.teamSize && Boolean(formik.errors.teamSize)}
              />
              {formik.touched.teamSize && formik.errors.teamSize && <FormHelperText error={true}>{formik.errors.teamSize}</FormHelperText>}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="projectId">Project</InputLabel>
              <Select
                fullWidth
                id="projectId"
                name="projectId"
                value={formik.values.projectId}
                onChange={formik.handleChange}
                error={formik.touched.projectId && Boolean(formik.errors.projectId)}
              >
                {projects?.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.projectId && formik.errors.projectId && (
                <FormHelperText error={true}>{String(formik.errors.projectId)}</FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="materialIds">Materials</InputLabel>
              <Select
                fullWidth
                id="materialIds"
                name="materialIds"
                multiple
                value={formik.values.materialIds}
                onChange={handleMaterialsChange}
                renderValue={(selected) => (
                  <Box>
                    {selected.map((value) => (
                      <Chip key={value} label={materials?.find((m) => m.id === value)?.name} style={{ marginRight: 4 }} />
                    ))}
                  </Box>
                )}
              >
                {materials?.map((material) => (
                  <MenuItem key={material.id} value={material.id}>
                    {material.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.materialIds && formik.errors.materialIds && (
                <FormHelperText error={true}>{formik.errors.materialIds}</FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              {isEditMode ? (
                <AlertDialog
                  title="Are you sure you want to delete this Request?"
                  description="Deleting this request is permanent and cannot be undone."
                  confirmText="Delete"
                  cancelText="Cancel"
                  onConfirm={handleDeleteRequest}
                  openButtonText="Delete Request"
                />
              ) : (
                ''
              )}
              <AnimateButton>
                <Button variant="contained" type="submit">
                  {isEditMode ? 'Update Request' : 'Create Request'}
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

RequestPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default RequestPage;
