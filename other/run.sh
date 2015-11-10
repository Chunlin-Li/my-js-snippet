#!/usr/bin/env bash

#!/bin/bash

STARTHDD=7
js_path=/home/test/logCompress/logArchive.js

CUR=$STARTHDD

while ((CUR < 36));do
    useage=`df -h |grep /hdd$CUR$| awk '{print $5}'|cut -d % -f 1`
    useage2=`df -h |grep /hdd$((CUR+1))$| awk '{print $5}'|cut -d % -f 1`

    if ((useage < 95 && useage2 <95));then
      break
    fi
    CUR=$((CUR+2))
done


echo useage = ${useage} and useage2 = ${useage2} and CUR = ${CUR}


sourcePath=/hdd1
targetPath=/hdd$CUR

targetDate=`date --date="-2 days" +"%Y-%m-%d"`
files=`find $sourcePath -name *debian.${targetDate}*`

node $js_path $CUR $files


