#include <jni.h>

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
