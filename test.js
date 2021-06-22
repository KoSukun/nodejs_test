// a = {'test': 1, 'test2':3};
// console.log(a['test']);
// console.log(a.test2);
// a['test2'] = 2
// console.log(a.test2);


const testFormattedTrims = () => {
    const selectedTrims = [
        {
            'fsc' : '12124G124KCV',
            'description' : 'Kona EV',
            'features' : [{
                'category': 'Exterior Color',
                'options': [
                    {
                        'description': 'Exterior Color Code',
                        'code':'OPT102',
                        'checked':true,
                        'dmsProductId':'a1214121512145ke'
                    }
                ]
            }]
        }]
        console.log(generateQuotationVO(selectedTrims));
    // console.log(returnValue);
}

// 각 index가 정의되어 있으므로 interior color에 해당

const generateQuotationVO = (param = []) => {
    let quotationVOList = [];

    param.forEach(trim => {
        let quotationVO = { 'fsc' : trim.fscCode, 'description' : trim.description };

        trim.features.forEach(feature => {
            feature.options.forEach(option => {
                let conditions = [];
                if(option.checked === true) {
                    let condition = {};
                    // Switch-Case with LABEL
                    switch (feature.category) {
                        case 'Exterior Color':      // PickList의 API로 참조
                            quotationVO['exteriorColorCode'] = option.code;
                            quotationVO['exteriorColorDescription'] = option.description;
                            break;
                        case 'Interior Color':
                            quotationVO['interiorColorCode'] = option.code;
                            quotationVO['interiorColorDescription'] = option.description;
                            break;
                        default:
                            condition['type'] = feature.category; // or etc에 대한 상세 category 필요 가능성 존재
                            condition['description'] = option.description;
                            condition['amount'] = option.listPrice;
                            conditions.push(condition);
                            break;
                      };
                    // case Exterior Color Code
                    // case Interior Color Code
                    // case Options
                    // case Etc
                    // ...

                    // 할인 등 적용 내역 일괄 적용 하는 부분 -> 따로 메서드로 구현하여 뺀 상태로, 다른곳에서도 해당 메서드로 호출 -> 초기일 경우와 config에서넘어온 경우분리하여 파악
                    // 가격 계산 시 quantity 등에 관한 고려도 필요

                    // true가 아닐 경우 추가되지 않음
                    quotationVOList.push(quotationVO);
                }
            });
        });
    });

    return quotationVOList;
}

testFormattedTrims();


const testGenerate = () => {
    const paramArray = [
        {'feature': {'fscCode' : 14120412, 'garbage': 12412412, 'description':'Exterior'}, 'trim': {'fsc': 123541, 'garbage2': 12414124, 'garbage124': 12412}, 'option': {'modelYear' : 1241, 'garbage1412': 1251, 'code': 1241, 'description':'test'} },
        {'feature': {'fscCode' : 1241212, 'garbage': 12412412, 'description':'Interior'}, 'trim': {'fsc': 124112, 'garbage2': 12414124, 'garbage124': 12412}, 'option': {'modelYear' : 1512, 'garbage1412': 1251, 'code': 1244, 'description':'test222'} }
    ]
    constrainGenerate(paramArray);
    // console.log(returnValue);
}

// 각 index가 정의되어 있으므로 interior color에 해당

const constrainGenerate = (param = []) => {
    // key: VehicleQuotationVO property variable name / value: finally referencing property variable name of VO
    const keyMap = [{key:'fsc',value:'fscCode'},
    {key:'modelYear',value:'modelYear'},
    {key:'exteriorColorCode',value:'code'},{key:'exteriorColorDescription',value:'description'},
    {key:'interiorColorCode',value:'code'},{key:'interiorColorDescription',value:'description'},
    {key:'totalAmount', value:'undetermined'},
    {key:'conditions', value:'undetermined'}];

    // total amount - 실시간 반영 - 최초 선택시 listPrice로?
    // 선택되어있는 번들에 대해서 수정 시에는 price + condition조합 참조하여 반영?
    const keysToBeParsedInFeature = ['exterior', 'interior'];
    let returnGeneratedArray = [];

    param.forEach(paramElement => {
        let keyValueGeneratedObject = {};
        keyMap.forEach(entry => {
            // key.entry = key.value에 해당하는 값 추출해서 매핑
            keyValueGeneratedObject[entry.key] = paramElement['option'][entry.value] != null ? (paramElement['option'][entry.value]) :
             (paramElement['feature'][entry.value] != null) ? paramElement['feature'][entry.value] :
             paramElement['trim'][entry.value];
             if(keyValueGeneratedObject[entry.key] == null) {
                 keysToBeParsedInFeature.forEach(keyFlag => {
                     if(entry.key.includes(keyFlag) && paramElement['feature']['description'].includes(keyFlag)) {
                         keyValueGeneratedObject[entry.key] = paramElement['option'][entry.value];
                     }
                 });
             }
             // keyElement의 가격정보 및 List Condition 계산 로직 호출
        })
        returnGeneratedArray.push(keyValueGeneratedObject);
    })

    console.log(returnGeneratedArray);

    return returnGeneratedArray;
}

const calculateAmountWithConditions = (param = []) => {

}

// testGenerate();

// const fireA = () => {
//     let param = [ 'A & B & 1' , 'C & D & 2 & !!' , 'E & F' ];
//     aFunction(param);
// }
// const aFunction = ( param = [] ) => {
//     param.forEach( entry => {
//         const [ key , val , detail ] = entry.split('&');
//         console.log( key , ' > ', val , ' > ' , detail );  
//     })
// }

// fireA();
// const fireB = () => {
//     // const param = [{key:'A',value:'aaa',child:{c1:'cccc',c2:'dddd'}}];
//     const paramArray = [{ 'feature' : {} , 'feature'}, {}]

//     const returnValue = generateQuotationVO();
//     console.log(returnValue);
// }
// const generateQuotationVO = ( param = [] ) => {
//     return [{'key' : a, 'value': b, 'child': {'c1':c1,'c2':c2}}] = param.map( entry => {
//         return {'key':entry.key , 'value':entry.value, 'child':entry.child};
//     });
// }
// fireB();


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