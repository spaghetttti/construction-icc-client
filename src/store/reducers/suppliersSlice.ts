import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Supplier = any;

export const suppliersApi = createApi({
  reducerPath: 'suppliersApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.SERVER_URL }), // Adjust base URL according to your API
  tagTypes: ['Supplier'],
  endpoints: (builder) => ({
    getSuppliers: builder.query<Supplier[], void>({
      query: () => 'suppliers',
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: 'Supplier' as const, id })), 'Supplier'] : ['Supplier'])
    }),
    getSupplierById: builder.query<Supplier, number>({
      query: (id) => `suppliers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Supplier', id }]
    }),
    addSupplier: builder.mutation<Supplier, Partial<Supplier>>({
      query: (newSupplier) => ({
        url: 'suppliers',
        method: 'POST',
        body: newSupplier
      }),
      invalidatesTags: ['Supplier']
    }),
    updateSupplier: builder.mutation<Supplier, Partial<Supplier>>({
      query: ({ id, ...updatedSupplier }) => ({
        url: `suppliers/${id}`,
        method: 'PUT',
        body: updatedSupplier
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Supplier', id }]
    }),
    deleteSupplier: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `suppliers/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Supplier', id }]
    })
  })
});

export default suppliersApi.reducer;

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation
} = suppliersApi;
