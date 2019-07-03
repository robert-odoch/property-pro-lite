#!/bin/sh

cd $TRAVIS_BUILD_DIR/API
sbt ++$TRAVIS_SCALA_VERSION package