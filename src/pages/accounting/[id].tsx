import { Button, Grid, InputLabel, TextField, Select, MenuItem, FormHelperText, FormControl } from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { useFormik } from 'formik';
// import * as yup from 'yup';
import { useRouter } from 'next/router';
import Layout from 'layout';
import { ReactElement, useState } from 'react';
import { useCreateTransactionMutation } from 'store/reducers/accountingReportsSlice';
import { useGetProjectsQuery } from 'store/reducers/projectsSlice';
import { useGetMaterialsQuery } from 'store/reducers/materialsSlice';
import { Stack } from '@mui/system';
import { useGetUsersQuery } from 'store/reducers/usersSlice';
import { useIntl } from 'react-intl';

// Form validation schema
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const validationSchema = yup.object({
//   dateOfTransaction: yup.date().required('Transaction date is required'),
//   amount: yup.number().required('Amount is required'),
//   type: yup.string().oneOf(['income', 'outcome'], 'Invalid transaction type').required('Transaction type is required'),
//   description: yup.string().required('Description is required'),
//   projectId: yup.number().nullable(),
//   materials: yup.array().of(
//     yup.object({
//       materialId: yup.number().required('Material is required'),
//       quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1')
//     })
//   )
// });

const TransactionPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { data: materials } = useGetMaterialsQuery();
  const { data: projects } = useGetProjectsQuery();
  const { data: users } = useGetUsersQuery();
  const [useSelect, setUseSelect] = useState(false);
  const [createTransaction] = useCreateTransactionMutation();
  const intl = useIntl();

  const formik = useFormik({
    initialValues: {
      dateOfTransaction: '',
      amount: 0,
      type: 'income',
      description: '',
      projectId: '',
      materials: [{ materialId: 0, quantity: 0 }],
      person: ''
    },
    // validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const result = await createTransaction(values);
      if ('error' in result) {
        setError((result.error as any).data.message);
      } else {
        router.push('/accounting');
      }
    }
  });

  const handleToggleInputMethod = () => {
    setUseSelect((prev) => !prev);
    formik.setFieldValue('person', '');
  };

  const today = new Date().toISOString().split('T')[0];

  const handleMaterialChange = (materialId: number, index: number) => {
    const updatedMaterials = [...formik.values.materials];
    updatedMaterials[index] = { ...updatedMaterials[index], materialId };
    formik.setFieldValue('materials', updatedMaterials);
  };

  const handleMaterialRedirect = (materialId: number | null = null) => {
    if (materialId) {
      window.open(`/inventory/${materialId}`, '_blank');
    } else {
      window.open('/inventory/new', '_blank');
    }
  };

  return (
    <MainCard title={intl.formatMessage({ id: 'create-transaction' })}>
      {error && (
        <FormHelperText error={true} sx={{ mb: 2 }}>
          {error}
        </FormHelperText>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Date of Transaction */}
          <Grid item xs={12}>
            <InputLabel htmlFor="dateOfTransaction">{intl.formatMessage({ id: 'transaction-date' })}</InputLabel>
            <TextField
              fullWidth
              id="dateOfTransaction"
              name="dateOfTransaction"
              type="date"
              value={formik.values.dateOfTransaction}
              onChange={formik.handleChange}
              error={formik.touched.dateOfTransaction && Boolean(formik.errors.dateOfTransaction)}
              helperText={formik.touched.dateOfTransaction && formik.errors.dateOfTransaction}
              inputProps={{ max: today }}
            />
          </Grid>

          {/* Amount */}
          <Grid item xs={12}>
            <InputLabel htmlFor="amount">{intl.formatMessage({ id: 'amount' })}</InputLabel>
            <TextField
              fullWidth
              id="amount"
              name="amount"
              type="number"
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
            />
          </Grid>

          {/* Type (income or outcome) */}
          <Grid item xs={12}>
            <InputLabel htmlFor="type">{intl.formatMessage({ id: 'transaction-type' })}</InputLabel>
            <Select
              fullWidth
              id="type"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <MenuItem value="income">Доход</MenuItem>
              <MenuItem value="outcome">Расход</MenuItem>
            </Select>
            {formik.touched.type && formik.errors.type && <FormHelperText error>{formik.errors.type}</FormHelperText>}
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <InputLabel htmlFor="description">{intl.formatMessage({ id: 'description' })}</InputLabel>
            <TextField
              fullWidth
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>

          {/* Project (optional) */}
          <Grid item xs={12}>
            <InputLabel htmlFor="projectId">{intl.formatMessage({ id: 'project-optional' })}</InputLabel>
            <Select fullWidth id="projectId" name="projectId" value={formik.values.projectId} onChange={formik.handleChange}>
              <MenuItem value="">None</MenuItem>
              {projects?.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="materials">{intl.formatMessage({ id: 'materials' })}</InputLabel>
              {formik.values.type === 'outcome' ? (
                <Stack spacing={1}>
                  {formik.values.materials.map((material, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="center">
                      <Select
                        fullWidth
                        id={`material-${index}`}
                        name={`materials[${index}].materialId`}
                        value={material.materialId}
                        onChange={(e) => handleMaterialChange(Number(e.target.value), material.quantity)}
                        error={formik.touched.materials && Boolean(formik.errors.materials)}
                      >
                        {materials?.map((mat) => (
                          <MenuItem key={mat.id} value={mat.id}>
                            {mat.name} (Available: {mat.quantity} {mat.unit})
                          </MenuItem>
                        ))}
                      </Select>
                      <Button fullWidth onClick={() => handleMaterialRedirect(material.materialId)} variant="outlined">
                        {intl.formatMessage({ id: 'modify-materials' })}
                      </Button>
                    </Stack>
                  ))}

                  {formik.touched.materials && formik.errors.materials && (
                    <FormHelperText error={true}>{(formik.errors.materials as any)[0]?.materialId}</FormHelperText>
                  )}
                </Stack>
              ) : (
                <Button fullWidth variant="outlined" onClick={() => handleMaterialRedirect()}>
                  {intl.formatMessage({ id: 'add-material' })}
                </Button>
              )}
              {formik.touched.materials && formik.errors.materials && (
                <FormHelperText error={true}>{(formik.errors.materials as any)[0]?.materialId}</FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <InputLabel htmlFor="user">{intl.formatMessage({ id: 'name-or-user' })}</InputLabel>
            <Stack
              sx={{
                justifyContent: 'space-evenly',
                alignItems: 'center'
              }}
              direction="row"
              spacing={2}
            >
              {!useSelect ? (
                <TextField
                  fullWidth
                  id="person"
                  name="person"
                  value={formik.values.person}
                  onChange={formik.handleChange}
                  error={formik.touched.person && Boolean(formik.errors.person)}
                  helperText={formik.touched.person && formik.errors.person}
                  placeholder={intl.formatMessage({ id: 'enter-name-manually' })}
                />
              ) : (
                <FormControl fullWidth error={formik.touched.person && Boolean(formik.errors.person)}>
                  <Select id="person" name="person" value={formik.values.person} onChange={formik.handleChange} displayEmpty>
                    <MenuItem value="" disabled>
                      {intl.formatMessage({ id: 'select-from-users-list' })}
                    </MenuItem>
                    {users &&
                      users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.username}
                        </MenuItem>
                      ))}
                  </Select>
                  <FormHelperText>{formik.touched.person && formik.errors.person}</FormHelperText>
                </FormControl>
              )}
              <FormControl fullWidth>
                {/* potentially dumb structure and call remove unnecessary components */}
                <FormHelperText>
                  <Button fullWidth variant="outlined" type="button" onClick={handleToggleInputMethod}>
                    {useSelect ? intl.formatMessage({ id: 'enter-name-manually' }) : intl.formatMessage({ id: 'select-from-users-list' })}
                  </Button>
                </FormHelperText>
              </FormControl>
            </Stack>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <AnimateButton>
              <Button fullWidth type="submit" variant="contained">
                {intl.formatMessage({ id: 'create-transaction' })}
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

TransactionPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TransactionPage;
