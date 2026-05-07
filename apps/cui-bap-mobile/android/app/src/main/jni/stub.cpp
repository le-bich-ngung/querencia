#include <jni.h>

extern "C" {

// ReactNativeFeatureFlags stubs
JNIEXPORT void JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_override(
    JNIEnv* env, jclass clazz, jobject provider) {}

JNIEXPORT jboolean JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_commonTestFlag(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

JNIEXPORT jboolean JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_fuseboxEnabledDebug(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

JNIEXPORT jboolean JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_fuseboxEnabledRelease(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

JNIEXPORT jboolean JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_enableFabricLogs(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

JNIEXPORT jboolean JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_enableMicrotasks(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

JNIEXPORT jboolean JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_enableViewRecycling(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

JNIEXPORT jboolean JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_useFabricInterop(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

// HermesExecutor stub for Old Architecture
JNIEXPORT jobject JNICALL
Java_com_facebook_hermes_reactexecutor_HermesExecutor_initHybridDefaultConfig(
    JNIEnv* env, jclass clazz, jboolean enableDebugger, jstring debuggerName) {
    return nullptr;
}
JNIEXPORT jboolean JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_enableEagerRootViewAttachment(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

JNIEXPORT jboolean JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_enableLongTaskAPI(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

JNIEXPORT jboolean JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_enableUIConsistency(
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }
} // extern "C"