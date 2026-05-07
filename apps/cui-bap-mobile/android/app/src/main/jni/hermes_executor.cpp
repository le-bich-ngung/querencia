#include <jni.h>

extern "C" {

JNIEXPORT jobject JNICALL
Java_com_facebook_hermes_reactexecutor_HermesExecutor_initHybridDefaultConfig(
    JNIEnv* env, jclass clazz, jboolean enableDebugger, jstring debuggerName) {
    return nullptr;
}

JNIEXPORT jobject JNICALL
Java_com_facebook_hermes_reactexecutor_HermesExecutor_initHybrid(
    JNIEnv* env, jclass clazz, jboolean enableDebugger, jstring debuggerName) {
    return nullptr;
}

}