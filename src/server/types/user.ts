import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: { 
        id: string; 
        username: string;
    };
}

export interface User {
    id: string;
    username: string;
    password: string;
    email: string;
}