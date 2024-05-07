/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.cordova.text

import com.scandit.datacapture.cordova.core.ScanditCaptureCore
import com.scandit.datacapture.cordova.core.errors.JsonParseError
import com.scandit.datacapture.cordova.core.utils.CordovaEventEmitter
import com.scandit.datacapture.cordova.core.utils.CordovaNoopResult
import com.scandit.datacapture.cordova.core.utils.CordovaResult
import com.scandit.datacapture.cordova.core.utils.CordovaResultKeepCallback
import com.scandit.datacapture.cordova.core.utils.PluginMethod
import com.scandit.datacapture.cordova.core.utils.defaultArgumentAsString
import com.scandit.datacapture.cordova.core.utils.optBoolean
import com.scandit.datacapture.frameworks.text.TextCaptureModule
import com.scandit.datacapture.frameworks.text.listeners.FrameworksTextCaptureListener
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaPlugin
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.lang.reflect.Method

class ScanditTextCapture :
    CordovaPlugin() {

    private val eventEmitter = CordovaEventEmitter()
    private val textCaptureModule = TextCaptureModule(FrameworksTextCaptureListener(eventEmitter))

    private lateinit var exposedFunctionsToJs: Map<String, Method>

    private var lastTextCaptureEnabledState: Boolean = false

    override fun onStop() {
        lastTextCaptureEnabledState = textCaptureModule.isModeEnabled()
        textCaptureModule.setModeEnabled(false, CordovaNoopResult())
    }

    override fun onStart() {
        textCaptureModule.setModeEnabled(lastTextCaptureEnabledState, CordovaNoopResult())
    }

    override fun onReset() {
        textCaptureModule.onDestroy()
        pluginInitialize()
    }

    override fun onDestroy() {
        textCaptureModule.onDestroy()
        super.onDestroy()
    }

    override fun pluginInitialize() {
        super.pluginInitialize()
        ScanditCaptureCore.addPlugin(serviceName)
        textCaptureModule.onCreate(cordova.context)

        // Init functions exposed to JS
        exposedFunctionsToJs =
            this.javaClass.methods.filter { it.getAnnotation(PluginMethod::class.java) != null }
                .associateBy { it.name }
    }

    override fun execute(
        action: String,
        args: JSONArray,
        callbackContext: CallbackContext
    ): Boolean {
        return if (exposedFunctionsToJs.contains(action)) {
            exposedFunctionsToJs[action]?.invoke(this, args, callbackContext)
            true
        } else {
            false
        }
    }

    @PluginMethod
    fun getDefaults(
        @Suppress("UNUSED_PARAMETER") args: JSONArray,
        callbackContext: CallbackContext
    ) {
        try {
            val defaults = textCaptureModule.getDefaults()
            val defaultsJson = JSONObject(
                mapOf(
                    "TextCapture" to defaults
                )
            )
            callbackContext.success(defaultsJson)
        } catch (e: Exception) {
            JsonParseError(e.message).sendResult(callbackContext)
        }
    }

    @PluginMethod
    fun subscribeTextCaptureListener(
        @Suppress("UNUSED_PARAMETER") args: JSONArray,
        callbackContext: CallbackContext
    ) {
        eventEmitter.registerCallback(
            FrameworksTextCaptureListener.ON_TEXT_CAPTURED_EVENT,
            callbackContext
        )
        textCaptureModule.addListener(CordovaResultKeepCallback(callbackContext))
    }

    @PluginMethod
    fun finishCallback(args: JSONArray, callbackContext: CallbackContext) {
        try {
            textCaptureModule.finishDidCapture(
                args.optBoolean("enabled", true),
                CordovaResult(callbackContext)
            )
        } catch (e: JSONException) {
            JsonParseError(e.message).sendResult(callbackContext)
        } catch (e: RuntimeException) { // TODO [SDC-1851] - fine-catch deserializer exceptions
            JsonParseError(e.message).sendResult(callbackContext)
        }
    }

    @PluginMethod
    fun updateTextCaptureMode(args: JSONArray, callbackContext: CallbackContext) {
        textCaptureModule.updateModeFromJson(
            args.defaultArgumentAsString,
            CordovaResult(callbackContext)
        )
    }

    @PluginMethod
    fun applyTextCaptureModeSettings(args: JSONArray, callbackContext: CallbackContext) {
        textCaptureModule.applyModeSettings(
            args.defaultArgumentAsString,
            CordovaResult(callbackContext)
        )
    }

    @PluginMethod
    fun updateTextCaptureOverlay(args: JSONArray, callbackContext: CallbackContext) {
        textCaptureModule.updateOverlay(
            args.defaultArgumentAsString,
            CordovaResult(callbackContext)
        )
    }

    @PluginMethod
    fun setModeEnabledState(args: JSONArray, callbackContext: CallbackContext) {
        textCaptureModule.setModeEnabled(
            args[0] as? Boolean ?: true,
            CordovaResult(callbackContext)
        )
    }
}
