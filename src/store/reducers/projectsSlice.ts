import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Project = any;

export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.SERVER_URL }), // Adjust base URL
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => 'projects',
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: 'Project' as const, id })), 'Project'] : ['Project'])
    }),
    getProjectById: builder.query<Project, number>({
      query: (id) => `projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }]
    }),
    addProject: builder.mutation<Project, Partial<Project>>({
      query: (newProject) => ({
        url: 'projects',
        method: 'POST',
        body: newProject
      }),
      invalidatesTags: ['Project']
    }),
    updateProject: builder.mutation<Project, Partial<Project>>({
      query: ({ id, ...updatedProject }) => ({
        url: `projects/${id}`,
        method: 'PUT',
        body: updatedProject
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }]
    }),
    deleteProject: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `projects/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Project', id }]
    })
  })
});

export const { useGetProjectsQuery, useGetProjectByIdQuery, useAddProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } =
  projectsApi;

export default projectsApi.reducer;
