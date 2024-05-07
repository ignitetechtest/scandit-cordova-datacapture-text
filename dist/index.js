var scanditCordovaDatacaptureCore = require('scandit-cordova-datacapture-core.Core');
var scanditDatacaptureFrameworksCore = require('scandit-cordova-datacapture-core.Core');

const defaultsFromJSON = (json) => {
    return {
        TextCapture: {
            TextCaptureOverlay: {
                DefaultBrush: {
                    fillColor: scanditDatacaptureFrameworksCore.Color
                        .fromJSON(json.TextCapture.TextCaptureOverlay.Brush.fillColor),
                    strokeColor: scanditDatacaptureFrameworksCore.Color
                        .fromJSON(json.TextCapture.TextCaptureOverlay.Brush.strokeColor),
                    strokeWidth: json.TextCapture.TextCaptureOverlay.Brush.strokeWidth,
                },
            },
            TextCaptureSettings: {
                recognitionDirection: json.TextCapture.TextCaptureSettings.recognitionDirection,
                duplicateFilter: json.TextCapture.TextCaptureSettings.duplicateFilter,
            },
            RecommendedCameraSettings: scanditDatacaptureFrameworksCore.CameraSettings
                .fromJSON(json.TextCapture.RecommendedCameraSettings),
        },
    };
};

// tslint:disable-next-line:variable-name
const Cordova = {
    pluginName: 'ScanditTextCapture',
    defaults: {},
    exec: (success, error, functionName, args) => scanditCordovaDatacaptureCore.cordovaExec(success, error, Cordova.pluginName, functionName, args),
};
function getDefaults() {
    return new Promise((resolve, reject) => {
        Cordova.exec((defaultsJSON) => {
            Cordova.defaults = defaultsFromJSON(defaultsJSON);
            resolve();
        }, reject, 'getDefaults', null);
    });
}
function initializeCordovaText() {
    scanditCordovaDatacaptureCore.initializePlugin(Cordova.pluginName, getDefaults);
}
var CordovaFunction;
(function (CordovaFunction) {
    CordovaFunction["SubscribeTextCaptureListener"] = "subscribeTextCaptureListener";
    CordovaFunction["UpdateTextCaptureMode"] = "updateTextCaptureMode";
    CordovaFunction["ApplyTextCaptureModeSettings"] = "applyTextCaptureModeSettings";
    CordovaFunction["UpdateTextCaptureOverlay"] = "updateTextCaptureOverlay";
    CordovaFunction["SetModeEnabledState"] = "setModeEnabledState";
    CordovaFunction["FinishCallback"] = "finishCallback";
})(CordovaFunction || (CordovaFunction = {}));

class CapturedText {
    get value() {
        return this._value;
    }
    get location() {
        return this._location;
    }
    static fromJSON(json) {
        const text = new CapturedText();
        text._value = json.value;
        text._location = scanditDatacaptureFrameworksCore.Quadrilateral.fromJSON(json.location);
        return text;
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class TextCaptureSession {
    get newlyCapturedTexts() {
        return this._newlyCapturedTexts;
    }
    get frameSequenceID() {
        return this._frameSequenceID;
    }
    static fromJSON(json) {
        const session = new TextCaptureSession();
        session._newlyCapturedTexts = json.newlyCapturedTexts
            .map(CapturedText.fromJSON);
        session._frameSequenceID = json.frameSequenceId;
        return session;
    }
}
class TextCaptureFeedback extends scanditDatacaptureFrameworksCore.DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.success = scanditDatacaptureFrameworksCore.Feedback.defaultFeedback;
    }
    static get default() {
        return new TextCaptureFeedback();
    }
}
class TextCaptureOverlay extends scanditDatacaptureFrameworksCore.DefaultSerializeable {
    static get defaultBrush() {
        return new scanditDatacaptureFrameworksCore.Brush(Cordova.defaults.TextCapture.TextCaptureOverlay.DefaultBrush.fillColor, Cordova.defaults.TextCapture.TextCaptureOverlay.DefaultBrush.strokeColor, Cordova.defaults.TextCapture.TextCaptureOverlay.DefaultBrush.strokeWidth);
    }
    get brush() {
        return this._brush;
    }
    set brush(newBrush) {
        this._brush = newBrush;
        this.textCapture.listenerProxy.updateTextCaptureOverlay(this);
    }
    get viewfinder() {
        return this._viewfinder;
    }
    set viewfinder(newViewfinder) {
        this._viewfinder = newViewfinder;
        this.textCapture.listenerProxy.updateTextCaptureOverlay(this);
    }
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(shouldShow) {
        this._shouldShowScanAreaGuides = shouldShow;
        this.textCapture.listenerProxy.updateTextCaptureOverlay(this);
    }
    static withTextCapture(textCapture) {
        return TextCaptureOverlay.withTextCaptureForView(textCapture, null);
    }
    static withTextCaptureForView(textCapture, view) {
        const overlay = new TextCaptureOverlay();
        overlay.textCapture = textCapture;
        if (view) {
            view.addOverlay(overlay);
        }
        return overlay;
    }
    constructor() {
        super();
        this.type = 'textCapture';
        this._shouldShowScanAreaGuides = false;
        this._viewfinder = null;
        this._brush = TextCaptureOverlay.defaultBrush;
    }
}
__decorate([
    scanditDatacaptureFrameworksCore.ignoreFromSerialization
], TextCaptureOverlay.prototype, "textCapture", void 0);
__decorate([
    scanditDatacaptureFrameworksCore.ignoreFromSerialization
], TextCaptureOverlay.prototype, "view", void 0);
__decorate([
    scanditDatacaptureFrameworksCore.nameForSerialization('shouldShowScanAreaGuides')
], TextCaptureOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
__decorate([
    scanditDatacaptureFrameworksCore.serializationDefault(scanditDatacaptureFrameworksCore.NoViewfinder),
    scanditDatacaptureFrameworksCore.nameForSerialization('viewfinder')
], TextCaptureOverlay.prototype, "_viewfinder", void 0);
__decorate([
    scanditDatacaptureFrameworksCore.nameForSerialization('brush')
], TextCaptureOverlay.prototype, "_brush", void 0);

var TextCaptureListenerEvent;
(function (TextCaptureListenerEvent) {
    TextCaptureListenerEvent["DidCapture"] = "TextCaptureListener.didCaptureText";
})(TextCaptureListenerEvent || (TextCaptureListenerEvent = {}));
class TextCaptureListenerProxy {
    static forTextCapture(textCapture) {
        const proxy = new TextCaptureListenerProxy();
        proxy.textCapture = textCapture;
        proxy.initialize();
        return proxy;
    }
    initialize() {
        this.subscribeListener();
    }
    updateTextCaptureMode() {
        return new Promise((resolve, reject) => {
            TextCaptureListenerProxy.cordovaExec(resolve, reject, CordovaFunction.UpdateTextCaptureMode, [JSON.stringify(this.textCapture.toJSON())]);
        });
    }
    applyTextCaptureModeSettings(newSettings) {
        return new Promise((resolve, reject) => {
            TextCaptureListenerProxy.cordovaExec(resolve, reject, CordovaFunction.ApplyTextCaptureModeSettings, [JSON.stringify(newSettings.toJSON())]);
        });
    }
    updateTextCaptureOverlay(overlay) {
        return new Promise((resolve, reject) => {
            TextCaptureListenerProxy.cordovaExec(resolve, reject, CordovaFunction.UpdateTextCaptureOverlay, [JSON.stringify(overlay.toJSON())]);
        });
    }
    setModeEnabledState(enabled) {
        return new Promise((resolve, reject) => {
            TextCaptureListenerProxy.cordovaExec(resolve, reject, CordovaFunction.SetModeEnabledState, [enabled]);
        });
    }
    subscribeListener() {
        TextCaptureListenerProxy.cordovaExec(this.notifyListeners.bind(this), null, CordovaFunction.SubscribeTextCaptureListener, null);
    }
    finishCallback() {
        return new Promise((resolve, reject) => {
            TextCaptureListenerProxy.cordovaExec(resolve, reject, CordovaFunction.FinishCallback, [{ 'enabled': this.textCapture.isEnabled }]);
        });
    }
    notifyListeners(event) {
        const done = () => {
            this.textCapture.isInListenerCallback = false;
            return { enabled: this.textCapture.isEnabled };
        };
        this.textCapture.isInListenerCallback = true;
        if (!event) {
            // The event could be undefined/null in case the plugin result did not pass a "message",
            // which could happen e.g. in case of "ok" results, which could signal e.g. successful
            // listener subscriptions.
            return done();
        }
        this.textCapture.listeners.forEach((listener) => {
            switch (event.name) {
                case TextCaptureListenerEvent.DidCapture:
                    if (listener.didCaptureText) {
                        listener.didCaptureText(this.textCapture, TextCaptureSession
                            .fromJSON(JSON.parse(event.argument.session)));
                    }
                    this.finishCallback();
                    break;
            }
        });
        return done();
    }
}
TextCaptureListenerProxy.cordovaExec = Cordova.exec;

class TextCapture extends scanditDatacaptureFrameworksCore.DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = 'textCapture';
        this._isEnabled = true;
        this._feedback = TextCaptureFeedback.default;
        this._context = null;
        this.listeners = [];
        this.isInListenerCallback = false;
    }
    get isEnabled() {
        return this._isEnabled;
    }
    set isEnabled(isEnabled) {
        var _a;
        this._isEnabled = isEnabled;
        (_a = this.listenerProxy) === null || _a === void 0 ? void 0 : _a.setModeEnabledState(isEnabled);
    }
    get context() {
        return this._context;
    }
    static get recommendedCameraSettings() {
        return new scanditDatacaptureFrameworksCore.CameraSettings(Cordova.defaults.TextCapture.RecommendedCameraSettings);
    }
    get feedback() {
        return this._feedback;
    }
    set feedback(feedback) {
        this._feedback = feedback;
        this.listenerProxy.updateTextCaptureMode();
    }
    static forContext(context, settings) {
        const textCapture = new TextCapture();
        textCapture.settings = settings;
        if (context) {
            context.addMode(textCapture);
        }
        textCapture.listenerProxy = TextCaptureListenerProxy.forTextCapture(textCapture);
        return textCapture;
    }
    applySettings(settings) {
        this.settings = settings;
        return this.listenerProxy.applyTextCaptureModeSettings(settings);
    }
    addListener(listener) {
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    }
    removeListener(listener) {
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
}
__decorate([
    scanditDatacaptureFrameworksCore.ignoreFromSerialization
], TextCapture.prototype, "_isEnabled", void 0);
__decorate([
    scanditDatacaptureFrameworksCore.nameForSerialization('feedback')
], TextCapture.prototype, "_feedback", void 0);
__decorate([
    scanditDatacaptureFrameworksCore.ignoreFromSerialization
], TextCapture.prototype, "_context", void 0);
__decorate([
    scanditDatacaptureFrameworksCore.ignoreFromSerialization
], TextCapture.prototype, "listeners", void 0);
__decorate([
    scanditDatacaptureFrameworksCore.ignoreFromSerialization
], TextCapture.prototype, "listenerProxy", void 0);
__decorate([
    scanditDatacaptureFrameworksCore.ignoreFromSerialization
], TextCapture.prototype, "isInListenerCallback", void 0);

class TextCaptureSettings extends scanditDatacaptureFrameworksCore.DefaultSerializeable {
    static fromJSON(json) {
        const settings = new TextCaptureSettings();
        Object.keys(json).forEach(key => {
            settings[key] = json[key];
        });
        return settings;
    }
    constructor() {
        super();
        this.duplicateFilter = Cordova.defaults.TextCapture.TextCaptureSettings.duplicateFilter;
        this.locationSelection = null;
        this.recognitionDirection = Cordova.defaults.TextCapture.TextCaptureSettings.recognitionDirection;
    }
}
__decorate([
    scanditDatacaptureFrameworksCore.serializationDefault(scanditDatacaptureFrameworksCore.NoneLocationSelection)
], TextCaptureSettings.prototype, "locationSelection", void 0);

initializeCordovaText();

exports.CapturedText = CapturedText;
exports.TextCapture = TextCapture;
exports.TextCaptureFeedback = TextCaptureFeedback;
exports.TextCaptureOverlay = TextCaptureOverlay;
exports.TextCaptureSession = TextCaptureSession;
exports.TextCaptureSettings = TextCaptureSettings;
