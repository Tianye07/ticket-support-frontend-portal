export interface SuccessResponse<T> {
    code: string;
    success: true;
    data: T;
}

