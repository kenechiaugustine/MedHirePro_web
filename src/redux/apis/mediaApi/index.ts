import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type { ISingleResponse } from '../../types';
import type {
    IMedia,
    IUploadMediaResponse,
    IDeleteMediaResponse,
} from './interface';

export const mediaApi = createApi({
    reducerPath: 'mediaApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Media'],
    endpoints: (builder) => ({
        uploadMedia: builder.mutation<IUploadMediaResponse, FormData>({
            query: (formData) => ({
                url: '/media/upload',
                method: 'POST',
                body: formData,
            }),
            transformResponse: (res: ISingleResponse<IUploadMediaResponse>) => res.data,
            invalidatesTags: ['Media'],
        }),
        getMediaInfo: builder.query<IMedia, string>({
            query: (mediaId) => ({
                url: `/media/${mediaId}`,
                method: 'GET',
            }),
            transformResponse: (res: ISingleResponse<IMedia>) => res.data,
            providesTags: (_result, _error, mediaId) => [{ type: 'Media', id: mediaId }],
        }),
        deleteMedia: builder.mutation<IDeleteMediaResponse, string>({
            query: (mediaId) => ({
                url: `/media/${mediaId}`,
                method: 'DELETE',
            }),
            transformResponse: (res: ISingleResponse<IDeleteMediaResponse>) => res.data,
            invalidatesTags: (_result, _error, mediaId) => [
                { type: 'Media', id: mediaId },
                'Media',
            ],
        }),
    }),
});

export const {
    useUploadMediaMutation,
    useGetMediaInfoQuery,
    useLazyGetMediaInfoQuery,
    useDeleteMediaMutation,
} = mediaApi;
