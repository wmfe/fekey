#!/usr/bin/env bash

#TEST_PATH=/home/work/repos/fis_plus/test/util/diff
TEST_PATH=/Users/ryan/workspace/fis-plus/test/util/diff_fis3_smarty
#FISP_PATH=/home/work/repos/fis_plus/
FISP_PATH=/Users/ryan/workspace/fis-plus/
cd ${TEST_PATH}
#WENKU_CODE_PATH=${TEST_PATH}/product_code/wenku
#WENKU_OUTPUT_PATH=${TEST_PATH}/product_output/wenku

#TIEBA_CODE_PATH=${TEST_PATH}/product_code/tieba
#TIEBA_OUTPUT_PATH=${TEST_PATH}/product_output/tieba

#BATMAN_CODE_PATH=${TEST_PATH}/product_code/batman
#BATMAN_OUTPUT_PATH=${TEST_PATH}/product_output/batman
#BATMAN_MODULES=(transit place common index addr feedback drive walk)

#PLACE_CODE_PATH=${TEST_PATH}/product_code/place
#PLACE_OUTPUT_PATH=${TEST_PATH}/product_output/place
#PLACE_MODULES=(admin beauty cater common detail hotel movie scope)

HAO123_CODE_PATH=${TEST_PATH}/product_code/hao123
HAO123_OUTPUT_PATH=${TEST_PATH}/product_output/hao123
HAO123_MODULES=(common home lv2)

#SUPERMAN_CODE_PATH=${TEST_PATH}/product_code/superman
#SUPERMAN_OUTPUT_PATH=${TEST_PATH}/product_output/superman
#SUPERMAN_MODULES=(transit place common index addr feedback drive walk third taxi user)

#获取fis version
if [ $1 = 'new' ]
then
	version=$(node ${FISP_PATH}/bin/fis-plus -v --no-color)
else
	version=$(fisp -v --no-color)
fi

OLD_IFS="$IFS"
IFS=" "
arr=($version)
IFS="$OLD_IFS"
v=${arr[1]}

# 执行release
if [ $1 = 'new' ]
then
	#wenku
	#rm -rf ${WENKU_OUTPUT_PATH}/output_new
	#cd ${WENKU_CODE_PATH}
	#node ${FISP_PATH}/bin/fis-plus release -cd ${WENKU_OUTPUT_PATH}/output_new --no-color
	#echo $v > ${WENKU_OUTPUT_PATH}/output_new/fis_version.txt
    #chmod 777 ${WENKU_OUTPUT_PATH}

	#tieba
	#rm -rf ${TIEBA_OUTPUT_PATH}/output_new
	#cd ${TIEBA_CODE_PATH}
	#node ${FISP_PATH}/bin/fis-plus release -cpd ${TIEBA_OUTPUT_PATH}/output_new --no-color
	#echo $v > ${TIEBA_OUTPUT_PATH}/output_new/fis_version.txt
    #chmod 777 ${TIEBA_OUTPUT_PATH}

	#batman
	rm -rf ${BATMAN_OUTPUT_PATH}/output_new
#	for module in ${BATMAN_MODULES[@]}
#	do
#	    cd ${BATMAN_CODE_PATH}/$module
#	    node ${FISP_PATH}/bin/fis-plus release -cpd ${BATMAN_OUTPUT_PATH}/output_new --no-color
#	done
#	echo $v > ${BATMAN_OUTPUT_PATH}/output_new/fis_version.txt
#    chmod 777 ${BATMAN_OUTPUT_PATH}

	#place
	rm -rf ${PLACE_OUTPUT_PATH}/output_new
#	for module in ${PLACE_MODULES[@]}
#	do
#	    cd ${PLACE_CODE_PATH}/$module
#	    node ${FISP_PATH}/bin/fis-plus release -cpd ${PLACE_OUTPUT_PATH}/output_new --no-color
#	done
#	echo $v > ${PLACE_OUTPUT_PATH}/output_new/fis_version.txt
#    chmod 777 ${PLACE_OUTPUT_PATH}

    #hao123
    rm -rf ${HAO123_OUTPUT_PATH}/output_new
    for module in ${HAO123_MODULES[@]}
    do
        cd ${HAO123_CODE_PATH}/$module
        node ${FISP_PATH}/bin/fis-plus release -cpd ${HAO123_OUTPUT_PATH}/output_new --no-color
    done
    echo $v > ${HAO123_OUTPUT_PATH}/output_new/fis_version.txt
    chmod 777 ${HAO123_OUTPUT_PATH}

    #superman
#    rm -rf ${SUPERMAN_OUTPUT_PATH}/output_new
#    for module in ${SUPERMAN_MODULES[@]}
#    do
#        cd ${SUPERMAN_CODE_PATH}/$module
#        node ${FISP_PATH}/bin/fis-plus release -cpd ${SUPERMAN_OUTPUT_PATH}/output_new --no-color
#    done
#    echo $v > ${SUPERMAN_OUTPUT_PATH}/output_new/fis_version.txt
#    chmod 777 ${SUPERMAN_OUTPUT_PATH}
else
	#wenku
	#rm -rf ${WENKU_OUTPUT_PATH}/output_old
	#cd ${WENKU_CODE_PATH}
	#fisp release -cd ${WENKU_OUTPUT_PATH}/output_old --no-color
	#echo $v > ${WENKU_OUTPUT_PATH}/output_old/fis_version.txt
    #chmod 777 -R ${WENKU_OUTPUT_PATH}/output_old

	#tieba
	#rm -rf ${TIEBA_OUTPUT_PATH}/output_old
	#cd ${TIEBA_CODE_PATH}
	#fisp release -cpd ${TIEBA_OUTPUT_PATH}/output_old --no-color
	#echo $v > ${TIEBA_OUTPUT_PATH}/output_old/fis_version.txt
    #chmod 777 -R ${TIEBA_OUTPUT_PATH}/output_old

    #batman
	rm -rf ${BATMAN_OUTPUT_PATH}/output_old
#	for module in ${BATMAN_MODULES[@]}
#	do
#		cd ${BATMAN_CODE_PATH}/$module
#		fisp release -cpd ${BATMAN_OUTPUT_PATH}/output_old --no-color
#	done
#	echo $v > ${BATMAN_OUTPUT_PATH}/output_old/fis_version.txt
#    chmod 777 -R ${BATMAN_OUTPUT_PATH}/output_old

	#place
	rm -rf ${PLACE_OUTPUT_PATH}/output_old
#	for module in ${PLACE_MODULES[@]}
#	do
#		cd ${PLACE_CODE_PATH}/$module
#		fisp release -cpd ${PLACE_OUTPUT_PATH}/output_old --no-color
#	done
#	echo $v > ${PLACE_OUTPUT_PATH}/output_old/fis_version.txt
#    chmod 777 -R ${PLACE_OUTPUT_PATH}/output_old

    #hao123
    rm -rf ${HAO123_OUTPUT_PATH}/output_old
    for module in ${HAO123_MODULES[@]}
    do
        cd ${HAO123_CODE_PATH}/$module
        fisp release -cpd ${HAO123_OUTPUT_PATH}/output_old --no-color
    done
    echo $v > ${HAO123_OUTPUT_PATH}/output_old/fis_version.txt
    chmod 777 -R ${HAO123_OUTPUT_PATH}/output_old

    #superman
    rm -rf ${SUPERMAN_OUTPUT_PATH}/output_old
#    for module in ${SUPERMAN_MODULES[@]}
#    do
#        cd ${SUPERMAN_CODE_PATH}/$module
#        fisp release -cpd ${SUPERMAN_OUTPUT_PATH}/output_old --no-color
#    done
#    echo $v > ${SUPERMAN_OUTPUT_PATH}/output_old/fis_version.txt
#    chmod 777 -R ${SUPERMAN_OUTPUT_PATH}/output_old
fi
