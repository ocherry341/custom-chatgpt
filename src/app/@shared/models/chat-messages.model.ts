import { SettingOption } from "./setting.model";

export interface ChatMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

export interface SavedChatMessage {
    title: string;
    message: ChatMessage[];
    option: SettingOption;
}