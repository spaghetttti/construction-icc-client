import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Material = {
  id: number;
  name: string;
  quantity: number;
  type: string;
  unit: string;
  costPerUnit: number;
};

export const materialsApi = createApi({
  reducerPath: 'materialsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.SERVER_URL}/inventory` }), // Adjust base URL according to your API
  tagTypes: ['Material'],
  endpoints: (builder) => ({
    getMaterials: builder.query<Material[], void>({
      query: () => 'materials',
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: 'Material' as const, id })), 'Material'] : ['Material'])
    }),
    getMaterialById: builder.query<Material, number>({
      query: (id) => `materials/${id}`,
      providesTags: (result, error, id) => [{ type: 'Material', id }]
    }),
    addMaterial: builder.mutation<Material, Partial<Material>>({
      query: (newMaterial) => ({
        url: 'materials',
        method: 'POST',
        body: newMaterial
      }),
      invalidatesTags: ['Material']
    }),
    updateMaterial: builder.mutation<Material, Partial<Material>>({
      query: ({ id, ...updatedMaterial }) => ({
        url: `materials/${id}`,
        method: 'PUT',
        body: updatedMaterial
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Material', id }]
    }),
    deleteMaterial: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `materials/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Material', id }]
    })
  })
});

export const {
  useGetMaterialsQuery,
  useGetMaterialByIdQuery,
  useAddMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation
} = materialsApi;

export default materialsApi.reducer;
