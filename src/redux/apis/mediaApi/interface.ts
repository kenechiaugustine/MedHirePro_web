export interface IMedia {
    _id: string;
    user_id: string;
    url: string;
    public_id: string;
    filename: string;
    mimetype: string;
    size: number;
    created_at: string;
}

export interface IUploadMediaResponse {
    message: string;
    media: IMedia;
}

export interface IDeleteMediaResponse {
    message: string;
}
