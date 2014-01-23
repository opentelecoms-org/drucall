#!/bin/bash

set -e

VERSION=$1

if [ -z "${VERSION}" ];
then
  echo "please specify version to release"
  exit 1
fi

TAR_FILE=drucall-${VERSION}.tar.gz

cd ..

if [ -e ${TAR_FILE} ];
then
  echo "already exists: ${TAR_FILE}"
  exit 1
fi

tar czf $TAR_FILE \
   drucall/AUTHORS \
   drucall/COPYING \
   drucall/css \
   drucall/doc \
   drucall/drucall* \
   drucall/*.txt \
   drucall/js \
   drucall/sounds

