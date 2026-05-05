#include <jni.h>

extern "C" {

// Delegate to libreactnative.so which contains the real implementation
JNIEXPORT jobject JNICALL
Java_com_facebook_react_runtime_hermes_HermesInstance_initHybrid(
    JNIEnv* env, jclass clazz, jobject jsRuntimeFactory, jboolean enableDebugger) {
    
    // Find the real function in libreactnative
    void* handle = dlopen("libreactnative.so", RTLD_NOW | RTLD_GLOBAL);
    if (handle) {
        typedef jobject (*InitHybridFn)(JNIEnv*, jclass, jobject, jboolean);
        InitHybridFn fn = (InitHybridFn)dlsym(handle, 
            "Java_com_facebook_react_runtime_hermes_HermesInstance_initHybrid");
        if (fn) return fn(env, clazz, jsRuntimeFactory, enableDebugger);
    }
    return nullptr;
}

} // extern "C"