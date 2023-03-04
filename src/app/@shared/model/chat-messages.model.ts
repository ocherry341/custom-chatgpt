export interface ChatMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

export interface ChatMessages extends Array<ChatMessage> { }