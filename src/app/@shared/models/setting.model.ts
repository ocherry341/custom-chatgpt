import { ChatRequest } from "./chat-request.model";

export interface ApiOptions extends Omit<ChatRequest, 'messages' | 'stream' | 'user'> { }

interface Value<T> {
    use: boolean;
    value: T;
}

export interface SettingOption {
    apikey: Value<string>;
    apiurl: Value<string>;
    system: Value<string>;
    memory: Value<number>;
    apiOptions: {
        [K in keyof ApiOptions]-?: Value<ApiOptions[K]>;
    };
}

export interface SettingValue {
    apikey: string;
    apiurl: string;
    system?: string;
    memory?: number;
    apiOptions: ApiOptions;
}

export interface SavedSettingOption {
    title: string;
    option: SettingOption;
}
