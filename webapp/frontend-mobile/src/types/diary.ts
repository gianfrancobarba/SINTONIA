export interface DiaryPage {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface CreateDiaryPageDto {
    title: string;
    content: string;
}

export interface UpdateDiaryPageDto {
    title?: string;
    content?: string;
}
