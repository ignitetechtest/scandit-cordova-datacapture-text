import { TextCaptureOverlay } from '../TextCapture+Related';
import { TextCaptureSettings } from '../TextCaptureSettings';
declare type TextCapture = any;
export declare class TextCaptureListenerProxy {
    private static cordovaExec;
    private textCapture;
    static forTextCapture(textCapture: TextCapture): TextCaptureListenerProxy;
    private initialize;
    updateTextCaptureMode(): Promise<void>;
    applyTextCaptureModeSettings(newSettings: TextCaptureSettings): Promise<void>;
    updateTextCaptureOverlay(overlay: TextCaptureOverlay): Promise<void>;
    setModeEnabledState(enabled: boolean): Promise<void>;
    private subscribeListener;
    finishCallback(): Promise<void>;
    private notifyListeners;
}
export {};
