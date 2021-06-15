// Param으로 Array (DataTableColumn의 Columns은 Array로 관리되므로), List<Object> 들어가면 해당 List에 Label, Value담은 뒤 반환
function addFieldValueWrapList(dataColumns, virtualObjectList){
    // init시 담아서 핸들링
    virtualObjectList.forEach(virtualObj => {
        let fieldValueMapList = [];
        dataColumns.forEach(column => {
            let fieldValueMapObj = {
                fieldName: column.fieldName,
                fieldValue: virtualObj[column.fieldName],
                label: column.label,
                type: column.type,
                validType: column.validType
            };
            fieldValueMapList.push(fieldValueMapObj);
        });
        virtualObj['fieldValueWrapList'] = fieldValueMapList;
    });
    return virtualObjectList;
}

// // Param으로 Array (DataTableColumn의 Columns은 Array로 관리되므로), List<Object> 들어가면 해당 List에 Label, Value담은 뒤 반환
// function addFieldValueWrapList(dataColumns, virtualObjectList){
//     // init시 담아서 핸들링
//     virtualObjectList.forEach(virtualObj => {
//         let fieldValueMapList = [];
//         dataColumns.forEach(column => {
//             fieldValueMapObj = {
//                 fieldName: column.fieldName,
//                 fieldValue: virtualObj[column.fieldName],
//                 label: column.label,
//                 type: column.type,
//                 validType: column.validType
//             };
//             fieldValueMapList.add(fieldValueMapObj);
//         });
//         virtualObj['fieldValueWrapList'] = fieldValueMapList;
//     });
//     return virtualObjectList;
// }

function generateVehicleGroup(){
    /*===============================================
    [전체 차량 목록]
     : component 에서 가지고있는 전체 차량 목록. Apex 조회 또는 UI 추가한 차량
    vehicleSpec = {
        fsc : ... ,
        modelyear : ... ,
        extColor : ... ,
        intColor : ... ,
        description : ...,
        extColorDescription : ... ,
        intColorDescription : ... ,
        conditions : [
            {
                type : ... ,
                description : ... ,
                amount : ...
            },
            {}, {} , ...
        ]
    }
     ===============================================*/
    let vehicleSpecs = [];
    let groupItems;    // UI 표기를 위한 grouping 목록 > component.get(v.groupItems) ???
     vehicleSpecs.forEach( vehicleSpec => {
        /*===============================================
         * 동일 차량스펙 Group 처리
         ===============================================*/
        // 동일 Spec 의 차량 group key 생성
        let groupKey = vehicleSpec.fsc + vehicleSpec.modelYear + vehicleSpec.extColor + vehicleSpec.intColor;
        // 전체 Group 목록에서 동일한 key 를 가진 index 확인
        let groupIndex = groupItems.map( groupItem => {
            return groupItem.groupKey;
        }).indexOf( groupkey );
        // index 존재하지 않는경우, Group 생성
        if( groupIndex === -1 ){
            let group = {
                groupKey        : groupKey,
                fsc             : vehicleSpec.fsc,
                modelYear       : vehicleSpec.modelYear,
                extColor        : vehicleSpec.extColor,
                intColor        : vehicleSpec.intColor,
                // ** 추가로 필요한 속성 정의 **
                vehicleItems    : [],
                quantity        : 0
            }
            groupItems.push(group);    
        }
        /*===============================================
         * 동일 차량스펙, 동일 가격 Group 처리
         ===============================================*/
        // Condition Key 생성 (Condition 목록 추출, 정렬하여 조합)
        const conditionKey = vehicleSpec.conditions.map( condition => {
            return condition.type + condition.description + condition.amount;
        }).sort().reduce((concatValue, value) => {
            return concatValue + value;
        },'');
        // Group 목록에서 동일한 Condition Key 로 구성된 차량 묶음 index 확인
        groupIndex = groupIndex !== -1 ? groupIndex : groupItems.length -1;
        const vehicleIndex = groupItems[groupIndex].vehicleItems.map( vehicleItem => {
            return vehicleItem.conditionKey;
        }).indexOf( conditionKey );
        // index 존재하지 않는 경우 Vehicle 묶음 생성
        if( vehicleIndex === -1 ){
            let vehicleItem = {
                conditionKey        : conditionKey,
                // ** 추가로 필요한 속성 정의 **
                quantity            : 1,
                conditions          : vehicleSpec.conditions
            };
            groupItems[groupIndex].vehicleItems.push(vehicleItem);
        }
        // index 존재하는 경우 차량 수량 추가
        else{
            gruopItems[groupIndex].vehicleItem[vehicleIndex].quantity = gruopItems[groupIndex].vehicleItem[vehicleIndex].quantity + 1;
        }
    });
    // UI 출력을 위한 Attribute 설정
    component.set('v.groupItems',groupItems);
}