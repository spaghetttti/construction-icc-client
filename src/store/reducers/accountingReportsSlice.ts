// slices/accountingReportsSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Project } from './projectsSlice';
import { User } from './usersSlice';

export type Report = {
  id: number;
  description: string;
  amount: number;
  dateOfTransaction: string;
  type: string; //dumb error in createtransactionpage
  project?: Project;
  material?: Record<string, number>[];
  person: User;
};

export type Accounting = {
  reports: Report[];
  balance: number;
};

export const accountingReportsApi = createApi({
  reducerPath: 'accountingReportsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.SERVER_URL }), // Adjust the base URL to your server
  tagTypes: ['Accounting', 'Report'],
  endpoints: (builder) => ({
    // Accounting-related endpoints
    getAccounting: builder.query<Accounting, void>({
      query: () => 'accounting',
      providesTags: ['Accounting']
    }),
    createTransaction: builder.mutation<Report, Partial<Report>>({
      query: (newTransaction) => ({
        url: 'accounting/transaction',
        method: 'POST',
        body: newTransaction
      }),
      invalidatesTags: ['Accounting']
    }),

    // Reports-related endpoints
    getReports: builder.query<Report[], void>({
      query: () => 'reports',
      providesTags: ['Report']
    }),
    getReportById: builder.query<Report, number>({
      query: (id) => `reports/${id}`,
      providesTags: (result, error, id) => [{ type: 'Report', id }]
    })
  })
});

export const { useGetAccountingQuery, useCreateTransactionMutation, useGetReportsQuery, useGetReportByIdQuery } = accountingReportsApi;

export default accountingReportsApi.reducer;
