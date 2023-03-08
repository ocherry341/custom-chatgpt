import { Provider } from "@angular/core";
import { HttpApiService } from "./http-api.service";
import { LocalStorageService } from "./local-storage.service";
import { StoreService } from "./store.service";


export const SERVICES: Provider[] = [
    LocalStorageService,
    StoreService,
    HttpApiService,
];

// @index('./*.service.ts', f => `export * from '${f.path}'`)
export * from './local-storage.service';
export * from './store.service';
// @endindex