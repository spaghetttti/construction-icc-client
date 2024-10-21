import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Project } from './projectsSlice';

export type Request = {
  id: number;
  status: string;
  teamSize: number;
  project: Project;
  materials: Record<string, number>[];
};

export const requestsApi = createApi({
  reducerPath: 'requestsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.SERVER_URL }), // Adjust base URL according to your API
  tagTypes: ['Request'],
  endpoints: (builder) => ({
    getRequests: builder.query<Request[], void>({
      query: () => 'requests',
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: 'Request' as const, id })), 'Request'] : ['Request'])
    }),
    getRequestById: builder.query<Request, number>({
      query: (id) => `requests/${id}`,
      providesTags: (result, error, id) => [{ type: 'Request', id }]
    }),
    addRequest: builder.mutation<Request, Partial<Request>>({
      query: (newRequest) => ({
        url: 'requests',
        method: 'POST',
        body: newRequest
      }),
      invalidatesTags: ['Request']
    }),
    updateRequest: builder.mutation<Request, Partial<Request>>({
      query: ({ id, ...updatedRequest }) => ({
        url: `requests/${id}`,
        method: 'PUT',
        body: updatedRequest
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Request', id }]
    }),
    deleteRequest: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `requests/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Request', id }]
    })
  })
});

export const { useGetRequestsQuery, useGetRequestByIdQuery, useAddRequestMutation, useUpdateRequestMutation, useDeleteRequestMutation } =
  requestsApi;

export default requestsApi.reducer;
