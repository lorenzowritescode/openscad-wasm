ARG DOCKER_TAG_BASE=openscad-base

FROM ${DOCKER_TAG_BASE}

ARG CMAKE_BUILD_TYPE=Release

COPY . . 
RUN emcmake cmake -B ../build . \
        -DCMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE} \
        -DEXPERIMENTAL=ON \
        -DSNAPSHOT=ON \
        -G Ninja && \
    cmake --build ../build --parallel
