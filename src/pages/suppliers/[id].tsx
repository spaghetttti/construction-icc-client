// material-ui imports
import { Button, Grid, InputLabel, Stack, TextField, Typography, FormHelperText, Box, Chip } from '@mui/material';

import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';

// form validation
import { useFormik } from 'formik';
import * as yup from 'yup';

// hooks and API queries
import { useRouter } from 'next/router';
import Layout from 'layout';
import { ReactElement, useState } from 'react';
import AlertDialog from 'components/AlertDialog';
import {
  useAddSupplierMutation,
  useDeleteSupplierMutation,
  useGetSupplierByIdQuery,
  useUpdateSupplierMutation
} from 'store/reducers/suppliersSlice';
import { CloseOutlined } from '@ant-design/icons';

const validationSchema = yup.object({
  name: yup.string().required('name is required'),
  contactInfo: yup.array().of(
    yup
      .string()
      .matches(/^\+\d+$/, 'формат номера телефона должен быть ввиде +1234567')
      .required('contactInfo is required')
  ),
  address: yup.string().required('address is required'),
  email: yup.string().email().required('Email is required')
});

const SupplierPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = Number(id);
  const { data: supplierData, isLoading } = useGetSupplierByIdQuery(Number(id), { skip: !isEditMode });
  const [updateSupplier] = useUpdateSupplierMutation();
  const [addSupplier] = useAddSupplierMutation();
  const [deleteSupplier, { isLoading: isDeleting }] = useDeleteSupplierMutation();
  const [error, setError] = useState<any>();
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: supplierData?.name || '',
      contactInfo: supplierData?.contactInfo || [],
      address: supplierData?.address || '',
      email: supplierData?.email || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('call');
      let result;
      if (isEditMode) result = await updateSupplier({ id, ...values });
      else result = await addSupplier(values);
      if ('error' in result) {
        setError((result.error as any).data.message);
      } else {
        router.push('/suppliers');
      }
    }
  });
  console.log(formik.errors);
  const handleSupplierDelete = async () => {
    const result = await deleteSupplier(Number(id));
    if ('error' in result) {
      console.log(result.error);
      setError((result.error as any).data.message);
    } else {
      router.push('/suppliers');
    }
  };

  const handleAddPhoneNumber = () => {
    if (newPhoneNumber && !formik.values.contactInfo.includes(newPhoneNumber)) {
      formik.setFieldValue('contactInfo', [...formik.values.contactInfo, newPhoneNumber]);
      setNewPhoneNumber('');
    }
  };

  const handleDeletePhoneNumber = (phoneNumberToDelete: string) => {
    formik.setFieldValue(
      'contactInfo',
      formik.values.contactInfo.filter((phone: string) => phone !== phoneNumberToDelete)
    );
  };

  if (isLoading || isDeleting) {
    return <div>Loading...</div>;
  }

  return (
    <MainCard title={isEditMode ? 'Edit Supplier' : 'Create Supplier'}>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="name">Suppliers Name</InputLabel>
              <TextField
                fullWidth
                id="name"
                name="name"
                placeholder="Enter suppliers name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
              />
              {formik.touched.name && formik.errors.name && <FormHelperText error={true}>{String(formik.errors.name)}</FormHelperText>}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="contactInfo">Contact Info (phone numbers)</InputLabel>
              <Box>
                {formik.values.contactInfo.map((phoneNumber: string, index: number) => (
                  <Chip
                    variant="outlined"
                    key={index}
                    label={phoneNumber}
                    onDelete={() => handleDeletePhoneNumber(phoneNumber)}
                    deleteIcon={<CloseOutlined />}
                    size="small"
                    style={{ marginRight: 4 }}
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                id="contactInfo"
                name="contactInfo"
                placeholder="Enter suppliers contactInfo"
                multiline
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.contactInfo && Boolean(formik.errors.contactInfo)}
              />
              {formik.errors.contactInfo && <FormHelperText error={true}>{String(formik.errors.contactInfo)}</FormHelperText>}
              <Button variant="contained" onClick={handleAddPhoneNumber}>
                Add Phone Number
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="address">Suppliers Address</InputLabel>
              <TextField
                fullWidth
                id="address"
                name="address"
                placeholder="Enter suppliers address"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
              />
              {formik.touched.address && formik.errors.address && (
                <FormHelperText error={true}>{String(formik.errors.address)}</FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email">Suppliers email</InputLabel>
              <TextField
                fullWidth
                id="email"
                name="email"
                placeholder="Enter suppliers email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
              />
              {formik.touched.email && formik.errors.email && <FormHelperText error={true}>{String(formik.errors.email)}</FormHelperText>}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              {isEditMode ? (
                <AlertDialog
                  title="Are you sure you want to delete this Supplier?"
                  description="Deleting this Supplier is permanent and cannot be undone."
                  confirmText="Delete"
                  cancelText="Cancel"
                  onConfirm={handleSupplierDelete}
                  openButtonText="Delete Supplier"
                />
              ) : (
                ''
              )}
              <AnimateButton>
                <Button variant="contained" type="submit">
                  {isEditMode ? 'Update Supplier' : 'Create Supplier'}
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

SupplierPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SupplierPage;
