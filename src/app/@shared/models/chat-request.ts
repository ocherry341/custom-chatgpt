import { ChatMessages } from "./chat-messages.model";

export interface ChatRequest {
    frequency_penalty?: number;
    logit_bias?: { [key: string]: any; };
    max_tokens?: number;
    /**
     * The ChatMessages to generate chat completions for, in the chat format.
     */
    ChatMessages: ChatMessages;
    /**
     * ID of the model to use. Currently, only gpt-3.5-turbo and gpt-3.5-turbo-0301 are
     * supported.
     */
    model: "gpt-3.5-turbo" | "gpt-3.5-turbo-0301";
    /**
     * How many chat completion choices to generate for each input ChatMessage.
     */
    n?: number;
    presence_penalty?: number;
    stop?: any[] | string;
    /**
     * If set, partial ChatMessage deltas will be sent, like in ChatGPT. Tokens will be sent as
     * data-only server-sent events as they become available, with the stream terminated by a
     * data: [DONE] ChatMessage.
     */
    stream?: boolean;
    /**
     * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the
     * output more random, while lower values like 0.2 will make it more focused and
     * deterministic.  We generally recommend altering this or top_p but not both.
     */
    temperature?: number;
    /**
     * An alternative to sampling with temperature, called nucleus sampling, where the model
     * considers the results of the tokens with top_p probability mass. So 0.1 means only the
     * tokens comprising the top 10% probability mass are considered.  We generally recommend
     * altering this or temperature but not both.
     */
    top_p?: number;
    user?: string;
}

export interface SettingOprions extends Omit<ChatRequest, 'ChatMessages' | 'model'> { }

