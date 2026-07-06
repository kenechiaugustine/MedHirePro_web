import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type { IReviewCreate, IReviewResponse, IReviewListParams } from './interface';

export const reviewsApi = createApi({
    reducerPath: 'reviewsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Reviews'],
    endpoints: (builder) => ({
        submitReview: builder.mutation<IReviewResponse, IReviewCreate>({
            query: (body) => ({
                url: '/reviews',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Reviews'],
        }),
        getReviews: builder.query<IReviewResponse[], IReviewListParams | void>({
            query: (params) => ({
                url: '/reviews',
                method: 'GET',
                params: params || {},
            }),
            providesTags: ['Reviews'],
        }),
        updateReviewVisibility: builder.mutation<IReviewResponse, { review_id: string; is_public: boolean }>({
            query: ({ review_id, is_public }) => ({
                url: `/reviews/${review_id}/visibility`,
                method: 'PUT',
                params: { is_public },
            }),
            invalidatesTags: ['Reviews'],
        }),
    }),
});

export const {
    useSubmitReviewMutation,
    useGetReviewsQuery,
    useLazyGetReviewsQuery,
    useUpdateReviewVisibilityMutation,
} = reviewsApi;
