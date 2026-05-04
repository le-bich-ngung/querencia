#include <jni.h>

extern "C" {

JNIEXPORT jobject JNICALL
Java_com_facebook_react_runtime_hermes_HermesInstance_initHybrid(
    JNIEnv* env, jclass clazz, jobject jsRuntimeFactory, jboolean enableDebugger) {
    return nullptr;
}

} // extern "C"
