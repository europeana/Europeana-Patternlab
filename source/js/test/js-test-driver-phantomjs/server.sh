#!/bin/bash

ROOTDIR="$( cd "$( dirname "$0")" && pwd )"
JSTD_VERSION=1.3.5

COMMAND=$1

command -v phantomjs >/dev/null 2>&1 || { echo "Can't find phantomjs, please make sure it's on your PATH." >&2; exit 1; }

if [ ! -f "$ROOTDIR/JsTestDriver-$JSTD_VERSION.jar" ]; then
    echo "Downloading JsTestDriver jar ..."
    curl http://js-test-driver.googlecode.com/files/JsTestDriver-$JSTD_VERSION.jar > $ROOTDIR/JsTestDriver-$JSTD_VERSION.jar
fi

if [ ! -f "$ROOTDIR/coverage-$JSTD_VERSION.jar" ]; then
    echo "Downloading coverage jar ..."
    curl http://js-test-driver.googlecode.com/files/coverage-$JSTD_VERSION.jar > $ROOTDIR/coverage-$JSTD_VERSION.jar
fi

if [[ $COMMAND == "start" ]]; then
    echo "Starting JSTD Server"

    nohup java -jar $ROOTDIR/JsTestDriver-$JSTD_VERSION.jar --port 9876 > $ROOTDIR/jstd.out 2> $ROOTDIR/jstd.err < /dev/null &
    echo $! > $ROOTDIR/jstd.pid

    echo "Starting PhantomJS"

    nohup phantomjs phantomjs-jstd.js > $ROOTDIR/phantomjs.out 2> $ROOTDIR/phantomjs.err < /dev/null &
    echo $! > $ROOTDIR/phantomjs.pid
fi

if [[ $COMMAND == "stop" ]]; then
    echo "Killing JSTD Server"

    PID=`cat $ROOTDIR/jstd.pid`
    kill $PID

    rm -f $ROOTDIR/jstd.out $ROOTDIR/jstd.err $ROOTDIR/jstd.pid

    echo "Killing PhantomJS"

    PID=`cat $ROOTDIR/phantomjs.pid`
    kill $PID

    rm -f $ROOTDIR/phantomjs.out $ROOTDIR/phantomjs.err $ROOTDIR/phantomjs.pid
fi
