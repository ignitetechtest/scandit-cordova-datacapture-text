import ScanditFrameworksText

struct TextCaptureCallbackResult: BlockingListenerCallbackResult {
    struct ResultJSON: Decodable {
        let enabled: Bool?
    }

    let finishCallbackID: ListenerEvent.Name
    let result: ResultJSON?

    var enabled: Bool? {
        guard let result = result else {
            return nil
        }

        return result.enabled
    }
}

fileprivate extension CordovaEventEmitter {
    func registerCallback(with event: FrameworksTextCaptureEvent, call: CDVInvokedUrlCommand) {
        registerCallback(with: event.rawValue, call: call)
    }
}

@objc(ScanditTextCapture)
public class ScanditTextCapture: CDVPlugin {
    var textModule: TextCaptureModule!
    var emitter: CordovaEventEmitter!

    override public func pluginInitialize() {
        super.pluginInitialize()
        emitter = CordovaEventEmitter(commandDelegate: commandDelegate)
        textModule = TextCaptureModule(
            textCaptureListener: FrameworksTextCaptureListener(emitter: emitter)
        )
        textModule.didStart()
    }

    public override func dispose() {
        textModule.didStop()
        emitter.removeCallbacks()
        super.dispose()
    }

    // MARK: Listeners

    @objc(subscribeTextCaptureListener:)
    func subscribeTextCaptureListener(command: CDVInvokedUrlCommand) {
        textModule.addListener()
        emitter.registerCallback(with: .didCaptureText, call: command)
        commandDelegate.send(.keepCallback, callbackId: command.callbackId)
    }

    // MARK: Defaults

    @objc(getDefaults:)
    func getDefaults(command: CDVInvokedUrlCommand) {
        let defaults = [
            "TextCapture": textModule.defaults.toEncodable()
        ]
        commandDelegate.send(.success(message: defaults), callbackId: command.callbackId)
    }

    @objc(finishCallback:)
    func finishCallback(command: CDVInvokedUrlCommand) {
        guard let result = command.defaultArgument as? [String: Any] else {
            commandDelegate.send(.failure(with: .invalidJSON), callbackId: command.callbackId)
            return
        }
        textModule.finishDidCaptureText(enabled: result["enabled"] as? Bool ?? true)
        commandDelegate.send(.success, callbackId: command.callbackId)
    }
    
    @objc(setModeEnabledState:)
    func setModeEnabledState(command: CDVInvokedUrlCommand) {
        guard let enabled = command.defaultArgument as? Bool else {
            commandDelegate.send(.failure(with: .invalidJSON), callbackId: command.callbackId)
            return
        }
        
        textModule.setModeEnabled(enabled: enabled)
        commandDelegate.send(.success, callbackId: command.callbackId)
    }
    
    @objc(updateTextCaptureOverlay:)
    func updateTextCaptureOverlay(command: CDVInvokedUrlCommand) {
        guard let overlayJson = command.defaultArgumentAsString else {
            commandDelegate.send(.failure(with: .invalidJSON), callbackId: command.callbackId)
            return
        }
        textModule.updateOverlay(overlayJson: overlayJson, result: CordovaResult(commandDelegate, command.callbackId))
    }
    
    @objc(updateTextCaptureMode:)
    func updateTextCaptureMode(command: CDVInvokedUrlCommand) {
        guard let modeJson = command.defaultArgumentAsString else {
            commandDelegate.send(.failure(with: .invalidJSON), callbackId: command.callbackId)
            return
        }
        textModule.updateModeFromJson(modeJson: modeJson, result: CordovaResult(commandDelegate, command.callbackId))
    }
    
    @objc(applyTextCaptureModeSettings:)
    func applyTextCaptureModeSettings(command: CDVInvokedUrlCommand) {
        guard let modeSettingsJson = command.defaultArgumentAsString else {
            commandDelegate.send(.failure(with: .invalidJSON), callbackId: command.callbackId)
            return
        }
        textModule.applyModeSettings(modeSettingsJson: modeSettingsJson, result: CordovaResult(commandDelegate, command.callbackId))
    }
}
