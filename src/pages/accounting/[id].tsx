import { Button, Grid, InputLabel, TextField, Select, MenuItem, FormHelperText } from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Layout from 'layout';
import { ReactElement, useState } from 'react';
// import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { useCreateTransactionMutation } from 'store/reducers/accountingReportsSlice';
import { useGetProjectsQuery } from 'store/reducers/projectsSlice';
import { useGetMaterialsQuery } from 'store/reducers/materialsSlice';
import { CloseOutlined } from '@ant-design/icons';
import { Stack } from '@mui/system';

// Form validation schema
const validationSchema = yup.object({
  dateOfTransaction: yup.date().required('Transaction date is required'),
  amount: yup.number().required('Amount is required'),
  type: yup.string().oneOf(['income', 'outcome'], 'Invalid transaction type').required('Transaction type is required'),
  description: yup.string().required('Description is required'),
  accountingId: yup.number().required('Accounting reference is required'),
  projectId: yup.number().nullable(),
  materials: yup
    .array()
    .of(
      yup.object({
        materialId: yup.number().required('Material ID is required'),
        quantity: yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required')
      })
    )
    .required('At least one material is required'),
  personIdId: yup.number().required('personId reference is required')
});

const TransactionPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { data: materials } = useGetMaterialsQuery();
  const { data: projects } = useGetProjectsQuery();

  const [createTransaction] = useCreateTransactionMutation();

  const formik = useFormik({
    initialValues: {
      dateOfTransaction: '',
      amount: 0,
      type: 'income',
      description: '',
      accountingId: '',
      projectId: '',
      materials: [{ materialId: 1, quantity: 1 }],
      personId: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values)
      const result = await createTransaction(values);
      if ('error' in result) {
        setError((result.error as any).data.message);
      } else {
        router.push('/transactions');
      }
    }
  });

  const handleMaterialChange = (materialId: number, quantity: number) => {
    const existingMaterial = formik.values.materials.find((m) => m.materialId === materialId);

    if (existingMaterial) {
      const updatedMaterials = formik.values.materials.map((m) => (m.materialId === materialId ? { ...m, quantity } : m));
      formik.setFieldValue('materials', updatedMaterials);
    } else {
      formik.setFieldValue('materials', [...formik.values.materials, { materialId, quantity }]);
    }
  };

  const handleMaterialRemove = (materialId: number) => {
    const updatedMaterials = formik.values.materials.filter((m) => m.materialId !== materialId);
    formik.setFieldValue('materials', updatedMaterials);
  };

  return (
    <MainCard title="Create New Transaction">
      {error && (
        <FormHelperText error={true} sx={{ mb: 2 }}>
          {error}
        </FormHelperText>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Date of Transaction */}
          <Grid item xs={12}>
            <InputLabel htmlFor="dateOfTransaction">Transaction Date</InputLabel>
            <TextField
              fullWidth
              id="dateOfTransaction"
              name="dateOfTransaction"
              type="date"
              value={formik.values.dateOfTransaction}
              onChange={formik.handleChange}
              error={formik.touched.dateOfTransaction && Boolean(formik.errors.dateOfTransaction)}
              helperText={formik.touched.dateOfTransaction && formik.errors.dateOfTransaction}
            />
          </Grid>

          {/* Amount */}
          <Grid item xs={12}>
            <InputLabel htmlFor="amount">Amount</InputLabel>
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
            <InputLabel htmlFor="type">Transaction Type</InputLabel>
            <Select
              fullWidth
              id="type"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="outcome">Outcome</MenuItem>
            </Select>
            {formik.touched.type && formik.errors.type && <FormHelperText error>{formik.errors.type}</FormHelperText>}
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <InputLabel htmlFor="description">Description</InputLabel>
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
            <InputLabel htmlFor="projectId">Project (Optional)</InputLabel>
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
              <InputLabel htmlFor="materials">Materials and Quantities</InputLabel>
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
                  <TextField
                    fullWidth
                    type="number"
                    value={material.quantity}
                    onChange={(e) => handleMaterialChange(material.materialId, Number(e.target.value))}
                    placeholder={`Quantity (Max: ${materials?.find((m) => m.id === material.materialId)?.quantity} ${
                      materials?.find((m) => m.id === material.materialId)?.unit
                    })`}
                    InputProps={{ inputProps: { min: 1, max: materials?.find((m) => m.id === material.materialId)?.quantity || 1000 } }}
                  />
                  <Button onClick={() => handleMaterialRemove(material.materialId)} variant="contained" color="error">
                    <CloseOutlined />
                  </Button>
                </Stack>
              ))}
              <Button onClick={() => handleMaterialChange(0, 1)} variant="outlined">
                Add Material
              </Button>
              {formik.touched.materials && formik.errors.materials && (
                <FormHelperText error={true}>{(formik.errors.materials as any)[0]?.materialId}</FormHelperText>
              )}
            </Stack>
          </Grid>

          {/* Materials
          <FieldArray
            name="materials"
            render={(arrayHelpers) => (
              <>
                {formik.values.materials.map((material, index) => (
                  <Grid container key={index} spacing={2} alignItems="center">
                    <Grid item xs={5}>
                      <InputLabel htmlFor={`materials[${index}].materialId`}>Material</InputLabel>
                      <Select
                        fullWidth
                        id={`materials[${index}].materialId`}
                        name={`materials[${index}].materialId`}
                        value={material.materialId}
                        onChange={formik.handleChange}
                        error={formik.touched.materials && Boolean(formik.errors.materials?.[index]?.materialId)}
                      >
                        {materials?.map((mat) => (
                          <MenuItem key={mat.id} value={mat.id}>
                            {mat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={5}>
                      <InputLabel htmlFor={`materials[${index}].quantity`}>Quantity</InputLabel>
                      <TextField
                        fullWidth
                        id={`materials[${index}].quantity`}
                        name={`materials[${index}].quantity`}
                        type="number"
                        value={material.quantity}
                        onChange={formik.handleChange}
                        error={formik.touched.materials && Boolean(formik.errors.materials?.[index]?.quantity)}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <IconButton onClick={() => arrayHelpers.remove(index)} disabled={formik.values.materials.length === 1}>
                        <CloseCircleOutlined />
                      </IconButton>
                      <IconButton onClick={() => arrayHelpers.push({ materialId: '', quantity: 1 })}>
                        <PlusCircleOutlined />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </>
            )}
          /> */}

          <Grid item xs={12}>
            <InputLabel htmlFor="user">PersonId</InputLabel>
            <TextField
              fullWidth
              id="personId"
              name="personId"
              value={formik.values.personId}
              onChange={formik.handleChange}
              error={formik.touched.personId && Boolean(formik.errors.personId)}
              helperText={formik.touched.personId && formik.errors.personId}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <AnimateButton>
              <Button fullWidth type="submit" variant="contained">
                Create Transaction
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
