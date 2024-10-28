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
import { useIntl } from 'react-intl';

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
  const intl = useIntl();

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
    <MainCard title={isEditMode ? intl.formatMessage({ id: 'edit-supplier' }) : intl.formatMessage({ id: 'create-supplier' })}>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="name">{intl.formatMessage({ id: 'supplier-name' })}</InputLabel>
              <TextField
                fullWidth
                id="name"
                name="name"
                placeholder={intl.formatMessage({ id: 'enter-suppliers-name' })}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
              />
              {formik.touched.name && formik.errors.name && <FormHelperText error={true}>{String(formik.errors.name)}</FormHelperText>}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="contactInfo">{intl.formatMessage({ id: 'contact-info-phone-numbers' })}</InputLabel>
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
                placeholder={intl.formatMessage({ id: 'enter-suppliers-contact-info' })}
                multiline
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.contactInfo && Boolean(formik.errors.contactInfo)}
              />
              {formik.errors.contactInfo && <FormHelperText error={true}>{String(formik.errors.contactInfo)}</FormHelperText>}
              <Button variant="contained" onClick={handleAddPhoneNumber}>
                {intl.formatMessage({ id: 'add-phone-number' })}
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="address">{intl.formatMessage({ id: 'suppliers-address' })}</InputLabel>
              <TextField
                fullWidth
                id="address"
                name="address"
                placeholder={intl.formatMessage({ id: 'enter-suppliers-address' })}
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
              <InputLabel htmlFor="email">{intl.formatMessage({ id: 'suppliers-email' })}</InputLabel>
              <TextField
                fullWidth
                id="email"
                name="email"
                placeholder={intl.formatMessage({ id: 'enter-suppliers-email' })}
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
                  title={intl.formatMessage({ id: 'are-you-sure-you-want-to-delete-this-supplier' })}
                  description={intl.formatMessage({ id: 'deleting-this-supplier-is-permanent-and-cannot-be-undone' })}
                  confirmText={intl.formatMessage({ id: 'delete' })}
                  cancelText={intl.formatMessage({ id: 'cancel' })}
                  onConfirm={handleSupplierDelete}
                  openButtonText={intl.formatMessage({ id: 'delete-supplier' })}
                />
              ) : (
                ''
              )}

              <AnimateButton>
                <Button variant="contained" type="submit">
                  {isEditMode ? intl.formatMessage({ id: 'update-supplier' }) : intl.formatMessage({ id: 'create-supplier' })}
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
