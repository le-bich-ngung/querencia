#include <jni.h>
#include <dlfcn.h>

extern "C" {

// Forward declaration - symbols exist in libreactnative.so
void Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_override(
    JNIEnv* env, jclass clazz, jobject provider) {
    // no-op stub
}

jboolean Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_commonTestFlag(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

jboolean Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_fuseboxEnabledDebug(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

jboolean Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_fuseboxEnabledRelease(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

jboolean Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_enableFabricLogs(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

jboolean Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_enableMicrotasks(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

jboolean Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_enableViewRecycling(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

jboolean Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_useFabricInterop(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

} // extern "C"// Stub � symbols are in libreactnative.so
// HermesExecutor stub for Old Architecture
extern "C" JNIEXPORT jobject JNICALL
Java_com_facebook_hermes_reactexecutor_HermesExecutor_initHybridDefaultConfig(
    JNIEnv* env, jclass clazz, jboolean enableDebugger, jstring debuggerName) {
    
    void* handle = dlopen("libhermes.so", RTLD_NOW | RTLD_GLOBAL);
    if (handle) {
        typedef jobject (*Fn)(JNIEnv*, jclass, jboolean, jstring);
        Fn fn = (Fn)dlsym(handle,
            "Java_com_facebook_hermes_reactexecutor_HermesExecutor_initHybridDefaultConfig");
        if (fn) return fn(env, clazz, enableDebugger, debuggerName);
    }
    return nullptr;
}