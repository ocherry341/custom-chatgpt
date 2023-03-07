import { ChatRequest } from "./chat-request";

interface ApiOptions extends Omit<ChatRequest, 'ChatMessages' | 'stream' | 'user'> { }

export interface Setting extends ApiOptions {
    apikey: string;
    apiurl: string;
    use: string | number;
    system?: string;
}