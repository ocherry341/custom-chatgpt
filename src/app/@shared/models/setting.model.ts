import { ChatRequest } from "./chat-request";

interface ApiOptions extends Omit<ChatRequest, 'ChatMessages' | 'stream' | 'user'> { }

export interface Setting extends ApiOptions {
    apikey: string;
    apiurl: string;
    system?: string;
}



export type SettingUse = {
    [key in keyof Setting]: boolean;
};