cmake_minimum_required(VERSION 3.13)
project(featureflags)

add_library(react_featureflagsjni SHARED stub.cpp)

find_library(log-lib log)

target_link_libraries(
  react_featureflagsjni
  ${log-lib}
)
