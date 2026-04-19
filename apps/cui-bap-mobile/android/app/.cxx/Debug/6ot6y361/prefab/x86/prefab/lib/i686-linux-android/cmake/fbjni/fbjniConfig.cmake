if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "C:/Users/lbngu/.gradle/caches/8.8/transforms/2036f0a17b5b559bdfbcbc2693bc2ce7/transformed/jetified-fbjni-0.6.0/prefab/modules/fbjni/libs/android.x86/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/lbngu/.gradle/caches/8.8/transforms/2036f0a17b5b559bdfbcbc2693bc2ce7/transformed/jetified-fbjni-0.6.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

