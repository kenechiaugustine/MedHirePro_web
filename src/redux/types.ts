export interface IPagination {
    perPage: number;
    currentPage: number;
    totalPage: number;
    totalDocumentCount: number;
}

export interface IPaginatedResponse<T> {
    data: T[];
    pagination: IPagination;
}

export interface ISingleResponse<T> {
    data: T;
}
