if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/lbngu/.gradle/caches/transforms-4/436992b11fb4afdd5f78615cc722f7ba/transformed/jetified-hermes-android-0.76.3-debug/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/lbngu/.gradle/caches/transforms-4/436992b11fb4afdd5f78615cc722f7ba/transformed/jetified-hermes-android-0.76.3-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

