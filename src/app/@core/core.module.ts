import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { throwIfAlreadyLoaded } from "./module-import-guard";
import { SERVICES } from "./services";

export const CORE_PROVIDERS = [
    ...SERVICES,
];


@NgModule()
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }

    static forRoot(): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [
                ...CORE_PROVIDERS,
            ],
        };
    }
}