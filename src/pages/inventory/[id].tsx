// material-ui imports
import { Button, Grid, InputLabel, Stack, TextField, Typography, FormHelperText, MenuItem, Select, FormControl } from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Layout from 'layout';
import { ReactElement, useState } from 'react';
import AlertDialog from 'components/AlertDialog';
import {
  useAddMaterialMutation,
  useDeleteMaterialMutation,
  useGetMaterialByIdQuery,
  useUpdateMaterialMutation
} from 'store/reducers/materialsSlice';
import { useGetSuppliersQuery } from 'store/reducers/suppliersSlice';

const validationSchema = yup.object({
  name: yup.string().required('Material name is required'),
  quantity: yup.number().required('Quantity is required').positive().integer(),
  type: yup.string().required('Material type is required'),
  unit: yup.string().required('Unit is required'),
  costPerUnit: yup.number().required('Cost per unit is required').positive(),
  supplier: yup.number().nullable()
});

const MaterialPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = Number(id);
  const { data: materialData, isLoading } = useGetMaterialByIdQuery(Number(id), { skip: !isEditMode });
  const { data: suppliers } = useGetSuppliersQuery();
  const [updateMaterial] = useUpdateMaterialMutation();
  const [addMaterial] = useAddMaterialMutation();
  const [deleteMaterial, { isLoading: isDeleting }] = useDeleteMaterialMutation();
  const [error, setError] = useState<any>();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: materialData?.name || '',
      quantity: materialData?.quantity || 0,
      type: materialData?.type || '',
      unit: materialData?.unit || 'другое',
      costPerUnit: materialData?.costPerUnit || 0,
      supplier: materialData?.supplier?.id || -1
    },
    validationSchema,
    onSubmit: async (values) => {
      let result;
      if (isEditMode) result = await updateMaterial({ id: Number(id), ...values });
      else result = await addMaterial(values);

      if ('error' in result) {
        setError((result.error as any).data.message);
      } else {
        router.push('/inventory');
      }
    }
  });

  const handleMaterialDelete = async () => {
    const result = await deleteMaterial(Number(id));
    if ('error' in result) {
      setError((result.error as any).data.message);
    } else {
      router.push('/inventory');
    }
  };

  if (isLoading || isDeleting) {
    return <div>Loading...</div>;
  }

  return (
    <MainCard title={isEditMode ? 'Edit Material' : 'Create Material'}>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Material Name */}
          <Grid item xs={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="name">Material Name</InputLabel>
              <TextField
                fullWidth
                id="name"
                name="name"
                placeholder="Enter material name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
              />
              {formik.touched.name && formik.errors.name && <FormHelperText error={true}>{String(formik.errors.name)}</FormHelperText>}
            </Stack>
          </Grid>

          {/* Material Quantity */}
          <Grid item xs={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="quantity">Quantity</InputLabel>
              <TextField
                fullWidth
                id="quantity"
                name="quantity"
                placeholder="Enter material quantity"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <FormHelperText error={true}>{String(formik.errors.quantity)}</FormHelperText>
              )}
            </Stack>
          </Grid>

          {/* Material Type */}
          <Grid item xs={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="type">Type</InputLabel>
              <TextField
                fullWidth
                id="type"
                name="type"
                placeholder="Enter material type"
                value={formik.values.type}
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
              />
              {formik.touched.type && formik.errors.type && <FormHelperText error={true}>{String(formik.errors.type)}</FormHelperText>}
            </Stack>
          </Grid>

          {/* Material Unit */}
          <Grid item xs={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="unit">Unit</InputLabel>
            <FormControl fullWidth error={formik.touched.unit && Boolean(formik.errors.unit)}>
              <Select id="unit" name="unit" value={formik.values.unit} onChange={formik.handleChange}>
                <MenuItem value="кг">кг</MenuItem>
                <MenuItem value="литр">литр</MenuItem>
                <MenuItem value="штука">штука</MenuItem>
                <MenuItem value="метр">метр</MenuItem>
                <MenuItem value="другое">другое</MenuItem>
              </Select>
            </FormControl>
              {formik.touched.unit && formik.errors.unit && <FormHelperText error={true}>{String(formik.errors.unit)}</FormHelperText>}
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="costPerUnit">Cost per Unit</InputLabel>
              <TextField
                fullWidth
                id="costPerUnit"
                name="costPerUnit"
                placeholder="Enter cost per unit"
                value={formik.values.costPerUnit}
                onChange={formik.handleChange}
                error={formik.touched.costPerUnit && Boolean(formik.errors.costPerUnit)}
              />
              {formik.touched.costPerUnit && formik.errors.costPerUnit && (
                <FormHelperText error={true}>{String(formik.errors.costPerUnit)}</FormHelperText>
              )}
            </Stack>
          </Grid>

          {/* Supplier (Optional) */}
          <Grid item xs={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="supplier">Supplier (Optional)</InputLabel>
              <FormControl fullWidth error={formik.touched.supplier && Boolean(formik.errors.supplier)}>
                <Select
                  id="supplier"
                  name="supplier"
                  placeholder="Select a supplier"
                  value={formik.values.supplier}
                  onChange={formik.handleChange}
                >
                  <MenuItem value={-1}>Без поставщика</MenuItem>
                  {suppliers?.map((supplier: any) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.touched.supplier && formik.errors.supplier && (
                <FormHelperText error={true}>{String(formik.errors.supplier)}</FormHelperText>
              )}
            </Stack>
          </Grid>

          {/* Submit or Delete Actions */}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              {isEditMode ? (
                <AlertDialog
                  title="Are you sure you want to delete this material?"
                  description="Deleting this material is permanent and cannot be undone."
                  confirmText="Delete"
                  cancelText="Cancel"
                  onConfirm={handleMaterialDelete}
                  openButtonText="Delete Material"
                />
              ) : (
                ''
              )}
              <AnimateButton>
                <Button variant="contained" type="submit">
                  {isEditMode ? 'Update Material' : 'Create Material'}
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

MaterialPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MaterialPage;
