#!/usr/bin/env bash

fileNamePattern=$1
filter=$2
output=$3

if [ -z $1 -o -z $2 ] || [ -z $3 ] ; then
  echo "input arguments error. fileNamePattern=\$1  filter=\$2  output=\$3"
  exit
fi
echo "fileNamePattern : $1"
echo "filter : $2"
echo "output : $3"

fileList=`find /hdd* -name $fileNamePattern`



for fileName in $fileList; do
  pigz -d $fileName
  fileName=${fileName/%.gz/}

## process every line and redirect it to other file.

  grep $filter $fileName >> $output

## end process
done
