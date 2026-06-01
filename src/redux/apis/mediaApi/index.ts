import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
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
            invalidatesTags: ['Media'],
        }),
        getMediaInfo: builder.query<IMedia, string>({
            query: (mediaId) => ({
                url: `/media/${mediaId}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, mediaId) => [{ type: 'Media', id: mediaId }],
        }),
        deleteMedia: builder.mutation<IDeleteMediaResponse, string>({
            query: (mediaId) => ({
                url: `/media/${mediaId}`,
                method: 'DELETE',
            }),
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
