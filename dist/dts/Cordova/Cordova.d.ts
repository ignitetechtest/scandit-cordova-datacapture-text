import { Defaults } from './Defaults';
export declare const Cordova: {
    pluginName: string;
    defaults: Defaults;
    exec: (success: Function | null, error: Function | null, functionName: string, args: [
        any
    ] | null) => void;
};
export declare function initializeCordovaText(): void;
export declare enum CordovaFunction {
    SubscribeTextCaptureListener = "subscribeTextCaptureListener",
    UpdateTextCaptureMode = "updateTextCaptureMode",
    ApplyTextCaptureModeSettings = "applyTextCaptureModeSettings",
    UpdateTextCaptureOverlay = "updateTextCaptureOverlay",
    SetModeEnabledState = "setModeEnabledState",
    FinishCallback = "finishCallback"
}
