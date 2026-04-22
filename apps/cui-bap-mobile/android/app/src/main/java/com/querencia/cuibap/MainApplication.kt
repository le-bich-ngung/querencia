package com.querencia.cuibap

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {
  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
            }
        override fun getJSMainModuleName(): String = "index"
        override fun getUseDeveloperSupport(): Boolean = false
        override val isNewArchEnabled: Boolean = false
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

override fun onCreate() {
    super.onCreate()
    // RN 0.76: patch SoLoader to handle renamed libraries
    System.loadLibrary("reactnative")
    SoLoader.init(this, false)
}}