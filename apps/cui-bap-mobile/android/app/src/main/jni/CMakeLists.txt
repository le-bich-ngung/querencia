cmake_minimum_required(VERSION 3.13)
project(featureflags)

find_library(log-lib log)

add_library(react_featureflagsjni SHARED stub.cpp)
target_link_libraries(react_featureflagsjni ${log-lib})

add_library(react_newarchdefaults SHARED newarchdefaults.cpp)
target_link_libraries(react_newarchdefaults ${log-lib})
add_library(appmodules SHARED appmodules.cpp)
target_link_libraries(appmodules ${log-lib})
add_library(rninstance SHARED rninstance.cpp)
target_link_libraries(rninstance ${log-lib})
add_library(hermesinstancejni SHARED hermesinstancejni.cpp)
target_link_libraries(hermesinstancejni ${log-lib})