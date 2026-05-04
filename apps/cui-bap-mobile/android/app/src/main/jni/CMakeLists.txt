cmake_minimum_required(VERSION 3.13)
project(featureflags)

find_library(REACTNATIVE_LIB reactnative)

add_library(react_featureflagsjni SHARED stub.cpp)
target_link_libraries(react_featureflagsjni \)
set_target_properties(react_featureflagsjni PROPERTIES OUTPUT_NAME "libreact_featureflagsjni")
