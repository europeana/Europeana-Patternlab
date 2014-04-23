#!/bin/bash

directories=( public public/patterns public/styleguide public/styleguide/html public/data )

DIR="$( cd "$( dirname "$0" )/.." && pwd )"
cd $DIR

for i in ${directories[*]}; do
	if [ ! -d $i ]; then
		mkdir $i
		echo "created directory $i"
	else
		echo "directory $i exists"
	fi
done;
