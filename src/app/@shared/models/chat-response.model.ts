import { ChatMessage } from "./chat-messages.model";
import { Model } from "./chat-request.model";


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
    message?: ChatMessage;
}


interface Usage {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
}


export interface ChatStreamResponse {
    choices: Choice[];
    created: number;
    id: string;
    object: string;
    model: Model;

}