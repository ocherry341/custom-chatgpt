import { ChatMessage } from "./chat-messages.model";


export interface ChatResponse {
    choices: Choice[];
    created: number;
    id: string;
    object: string;
    usage: Usage;
}

interface Choice {
    finish_reason?: string;
    index?: number;
    ChatMessage?: ChatMessage;
}


interface Usage {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
}