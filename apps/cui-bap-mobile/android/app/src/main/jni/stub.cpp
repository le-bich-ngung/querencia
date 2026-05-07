#include <jni.h>

#define FF(name) \
JNIEXPORT jboolean JNICALL \
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_##name(\
    JNIEnv* env, jclass clazz) { return JNI_FALSE; }

extern "C" {

JNIEXPORT void JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_override(
    JNIEnv* env, jclass clazz, jobject provider) {}

JNIEXPORT void JNICALL
Java_com_facebook_react_internal_featureflags_ReactNativeFeatureFlagsCxxInterop_dangerouslyReset(
    JNIEnv* env, jclass clazz) {}

FF(commonTestFlag)
FF(allowRecursiveCommitsWithSynchronousMountOnAndroid)
FF(batchRenderingUpdatesInEventLoop)
FF(completeReactInstanceCreationOnBgThreadOnAndroid)
FF(destroyFabricSurfacesInReactInstanceManager)
FF(enableAlignItemsBaselineOnFabricIOS)
FF(enableAndroidMixBlendModeProp)
FF(enableBackgroundStyleApplicator)
FF(enableCleanTextInputYogaNode)
FF(enableEagerRootViewAttachment)
FF(enableEventEmitterRetentionDuringGesturesOnAndroid)
FF(enableFabricLogs)
FF(enableFabricRendererExclusively)
FF(enableGranularShadowTreeStateReconciliation)
FF(enableIOSViewClipToPaddingBox)
FF(enableLayoutAnimationsOnIOS)
FF(enableLongTaskAPI)
FF(enableMicrotasks)
FF(enablePropsUpdateReconciliationAndroid)
FF(enableReportEventPaintTime)
FF(enableSynchronousStateUpdates)
FF(enableUIConsistency)
FF(enableViewRecycling)
FF(excludeYogaFromRawProps)
FF(fetchImagesInViewPreallocation)
FF(fixIncorrectScrollViewStateUpdateOnAndroid)
FF(fixMappingOfEventPrioritiesBetweenFabricAndReact)
FF(fixMissedFabricStateUpdatesOnAndroid)
FF(fixMountingCoordinatorReportedPendingTransactionsOnAndroid)
FF(forceBatchingMountItemsOnAndroid)
FF(fuseboxEnabledDebug)
FF(fuseboxEnabledRelease)
FF(initEagerTurboModulesOnNativeModulesQueueAndroid)
FF(lazyAnimationCallbacks)
FF(loadVectorDrawablesOnImages)
FF(setAndroidLayoutDirection)
FF(traceTurboModulePromiseRejectionsOnAndroid)
FF(useFabricInterop)
FF(useImmediateExecutorInAndroidBridgeless)
FF(useModernRuntimeScheduler)
FF(useNativeViewConfigsInBridgelessMode)
FF(useNewReactImageViewBackgroundDrawing)
FF(useOptimisedViewPreallocationOnAndroid)
FF(useOptimizedEventBatchingOnAndroid)
FF(useRuntimeShadowNodeReferenceUpdate)
FF(useRuntimeShadowNodeReferenceUpdateOnLayout)
FF(useStateAlignmentMechanism)
FF(useTurboModuleInterop)

} // extern "C"