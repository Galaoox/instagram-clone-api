export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    username: string;
    imageUrl?: string;
    biography?: string;
    webSite?: string;
    token?: string;
}