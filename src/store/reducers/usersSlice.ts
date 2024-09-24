// slices/usersSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type User = any;

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.SERVER_URL }), // Adjust base URL according to your API
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: 'User' as const, id })), 'User'] : ['User'])
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }]
    }),
    addUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser
      }),
      invalidatesTags: ['User']
    }),
    updateUser: builder.mutation<User, Partial<User>>({
      query: ({ id, ...updatedUser }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: updatedUser
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }]
    }),
    deleteUser: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }]
    })
  })
});

export default usersApi.reducer;

// Export hooks for usage in functional components
export const { useGetUsersQuery, useGetUserByIdQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApi;
