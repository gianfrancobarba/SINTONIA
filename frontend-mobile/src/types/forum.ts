export type ForumCategory = 'ansia' | 'stress' | 'tristezza' | 'vita_di_coppia';

export interface ForumPost {
    id: string;
    title: string;
    content: string;
    category: ForumCategory;
    author: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface CreatePostDto {
    title: string;
    content: string;
    category: ForumCategory;
}

export interface CategoryInfo {
    id: ForumCategory;
    label: string;
    color: string;
}
