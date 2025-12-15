// Types for Clinical Alerts

export interface ClinicalAlert {
    idAlert: string;
    dataAlert: Date | string;
    stato: boolean;
}

export interface LoadingState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}
