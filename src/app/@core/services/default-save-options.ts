import { SavedSettingOption } from "src/app/@shared/models/setting.model";
import { environment } from "src/environments/environment";

export const defaultSavedOptions: SavedSettingOption[] = [
    {
        title: $localize`:Default Options title:默认设置`,
        option: {
            apikey: { use: true, value: '' },
            apiurl: { use: true, value: environment.defaultUrl },
            system: { use: true, value: 'You are a helpful assistant.' },
            memory: { use: false, value: -1 },
            apiOptions: {
                model: { use: true, value: 'gpt-3.5-turbo' },
                temperature: { use: true, value: 1 },
                top_p: { use: false, value: 1 },
                max_tokens: { use: false, value: 1 },
                n: { use: false, value: 1 },
                presence_penalty: { use: false, value: 0 },
                frequency_penalty: { use: false, value: 0 },
                logit_bias: { use: false, value: undefined },
                stop: { use: false, value: undefined },
            },
        }
    },
    {
        title: $localize`:Default Options title:中英互译`,
        option: {
            apikey: { use: true, value: '' },
            apiurl: { use: true, value: environment.defaultUrl },
            system: { use: true, value: 'You are a helpful assistant for Chinese-English translator, just translate the following text' },
            memory: { use: false, value: 0 },
            apiOptions: {
                model: { use: true, value: 'gpt-3.5-turbo' },
                temperature: { use: true, value: 1 },
                top_p: { use: false, value: 1 },
                max_tokens: { use: false, value: 1 },
                n: { use: false, value: 1 },
                presence_penalty: { use: false, value: 0 },
                frequency_penalty: { use: false, value: 0 },
                logit_bias: { use: false, value: undefined },
                stop: { use: false, value: undefined },
            },
        }
    }
];