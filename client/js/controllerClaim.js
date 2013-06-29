'use strict';


function ClaimCtrl($scope, masModel, masHelper, socket,$q,serviceCodes,masCrud)//,myServiceCode2)
{
    $scope.form={};
    $scope.isTest=null;
    $scope.form.text='john';
    var dd = new Date;
    var now = new Date();

  // add one week exactly
    now.setDate(now.getDate() - 7);
    $scope.form.SET_WORK_DATE1=now;
    $scope.form.SET_WORK_DATE2=dd;
    $scope.form.ADJUSTER_ID=135;
    $scope.form.SET_WORK_DATEDEF =dd;
    $scope.form.SET_WORK_DATEDEFSHORT= moment(dd).format("MM/DD/YYYY") ;
    $scope.currentClaim;
    var editrowTemplate = '<i class="icon-edit edit" ng-click="editrow(row.entity)"></i>';

    var cellTemplate3 = '<div class="ngCellText" ng-click="editrow(row.entity)">{{row.getProperty(col.field)}}</div>';
    $scope.myDefs2 = [
        // { field:'edit', displayName:'Edit', headerClass:'Edit', width:'45', cellTemplate:editrowTemplate },
        { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplate ,visible:false},
        { field: 'DAILY_DETAIL_ID', displayName: 'DailyDetailID', groupable: false, width: 55, cellTemplate: cellTemplate3,visible:true },
        { field: 'DAILY_ID', displayName: 'Daily Id', groupable: true, width: 55, cellTemplate: cellTemplate3,visible:false },
        { field: 'WORK_DATE', displayName: 'Date', width: 65, cellTemplate: cellTemplate3,cellFilter:'date' },
        { field: 'WORK_TIME', displayName: 'Time', width: 45, cellTemplate: cellTemplate3 },
        { field: 'WORK_DESCRIPTION', displayName: 'Desciption', width: 125, cellTemplate: cellTemplate3 },
        { field: 'servicedesc', displayName: 'Service', width: 125, cellTemplate: cellTemplate3 },
        { field: 'MILEAGE', displayName: 'Mileage', width: 55},
        { field: 'EXPENSE', displayName: 'Expsense Amt', width: 55, cellTemplate: cellTemplate3,cellFilter:'currency' },
        { field: 'expensedesc', displayName: 'Expsense Type', width: 65, cellTemplate: cellTemplate3 },
        { field: 'AR_ID', displayName: 'ARID', width: 55, cellTemplate: cellTemplate3 },
        { field: 'AR_DATE', displayName: 'Ar Date', width: 55, cellTemplate: cellTemplate3 ,visible:true},
        { field: 'CLAIM_NO', displayName: 'ClaimNo', width: 65, cellTemplate: cellTemplate3 },
        { field: 'WEEKOF', displayName: 'WK#', width: 45} ,
        { field: 'SERVICE_ID', displayName: 'SERVICE_ID', width: 55, cellTemplate: cellTemplate3 ,visible:false},
        { field: 'EXPENSE_TYPE_ID', displayName: 'EXPENSE_TYPE_ID', width: 55, cellTemplate: cellTemplate3 ,visible:false}


    ]

//
// orig - now refactor to service
//    socket.emit('getcodeTypes', {});
//    socket.on('initcode1', function (obj) {
//        $scope.types = obj.Code1;// angular.toJson(obj.Code1, true);
//        //  console.log('$scope.types ', $scope.types);
//        $scope.typesIndex = masHelper.buildIndex($scope.types, 'id');
//        console.log('ind ', $scope.typesIndex);
//    });

//    myServiceCode1.init().then(function(result){
//        $scope.types  = result;
//        $scope.typesIndex = masHelper.buildIndex($scope.types, 'id');
//        console.log('$scope.types ctrl ',$scope.types ) ;
//    })
// this calls service so we can share
    serviceCodes.getCode1().then(function(result){
        $scope.types  = result;
        $scope.typesIndex = masHelper.buildIndex($scope.types, 'id');
        console.log('$scope.types ctrl ',$scope.types ) ;
    }) ;

    serviceCodes.getCode2().then(function(result){
        $scope.services  = result;
        $scope.servicesIndex = masHelper.buildIndex($scope.services, 'id');

    }) ;
    serviceCodes.getCode3().then(function(result){
        $scope.expenses  = result;
        $scope.expensesIndex = masHelper.buildIndex($scope.expenses, 'id');

    }) ;


    $scope.statuses = masModel.getStatuses();    // not in use



    $scope.getClaims = function () {
        masCrud.getClaims().then(function(result){
            $scope.claims  = result;
            console.log($scope.claims);
            $scope.setCurrentClaim ($scope.claims[0]);
        }) ;
    }
    $scope.getClaims();

    // console.log('aft getClaims ');//,$scope.claims[0]);
    $scope.statusesIndex = masHelper.buildIndex($scope.statuses, 'name');

    $scope.changeData= function (form) {
        socket.emit('getdailybydate', form);// data does not work
        socket.on('initdailybydate', function (obj) {
            $scope.dailybydate = obj.Daily;
        });
    };

    $scope.tabWasSelected = function (tabIndex) {
        console.log('tabIndex ',tabIndex);
    }
    $scope.setCurrentClaim = function (claim) {

        $scope.currentClaim = claim;
       // $scope.form.SET_CLAIMNO=claim.title;
        $scope.currentClaimNo = claim.title;

        $scope.currentStatus = $scope.statusesIndex[claim.status];
        $scope.currentType = $scope.typesIndex[claim.type];
        // var local = claim;
        console.log('claim ', claim);
        socket.emit('getdaily', claim);
        socket.on('initdaily', function (obj) {
            $scope.daily = obj.Daily;
            $scope.setCurrentDaily($scope.daily[0])  ; // 5-30 9pm

        });
    };


    $scope.setCurrentDaily = function (daily) {
        $scope.currentDaily = daily;
        console.log('currentDaily1  ', daily.SERVICE_ID);
        $scope.currentService = $scope.servicesIndex[daily.SERVICE_ID];
        $scope.currentExpense = $scope.expensesIndex[daily.EXPENSE_TYPE_ID];
        console.log('currentDaily  ', daily);
    };


    $scope.filteringText = '';
    $scope.filterOptions = {
        filterText: '',          //filteringText
        useExternalFilter: false
    };
    $scope.mySelections = [];

    $scope.afterSelectionChange = function () {
        $scope.currentDaily = $scope.gridOptions1.selectedItems[0];
//        $scope.setCurrentDaily (  $scope.currentDaily);    dont use

    };

    $scope.editrow = function (row) {
        // this is just an object
        console.log('in ed')
        $scope.currentDaily = row;
        $scope.setCurrentDaily(row);//$scope.currentDaily );

        //5-31
        $scope.currentClaimNo  =row.CLAIM_NO;
    }
    $scope.gridOptions1 = {
        data: 'daily',
        multiSelect: false,
        // primaryKey: 'ID',
        filterOptions: $scope.filterOptions,
        //beforeSelectionChange: self.selectionchanging,
        columnDefs: 'myDefs2',
        selectedItems: $scope.mySelections,
        enableRowReordering: false,
        showGroupPanel: true,
        showColumnMenu: true,
        //groups: ['SeasonCode', 'Vendor']
        // enablePinning: true,
        maintainColumnRatios: false,
        groups: [],
        //plugins: [new ngGridCsvExportPlugin(csvOpts)],
        showFooter: true,
        enableColumnResize: true,
        enableColumnReordering: true,
        enableCellSelection: true,
        enableRowSelection: true
        ,afterSelectionChange: $scope.afterSelectionChange
    };

    $scope.gridOptions2 = {
        data: 'dailybydate',
        multiSelect: false,
        // primaryKey: 'ID',
        filterOptions: $scope.filterOptions,
        //beforeSelectionChange: self.selectionchanging,
        columnDefs: 'myDefs2',
        selectedItems: $scope.mySelections,
        enableRowReordering: false,
        showGroupPanel: true,
        showColumnMenu: true,
        //groups: ['SeasonCode', 'Vendor']
        // enablePinning: true,
        maintainColumnRatios: false,
        groups: [],
        //plugins: [new ngGridCsvExportPlugin(csvOpts)],
        showFooter: true,
        enableColumnResize: true,
        enableColumnReordering: true,
        enableCellSelection: true,
        enableRowSelection: true
        ,afterSelectionChange: $scope.afterSelectionChange
    };


// does not work for newly inserted row
//  $scope.selectNewRow = function () {
//        angular.forEach($scope.daily, function (data, index) {
//          //  console.log('dd ', data.DAILY_DETAIL_ID + ' ' + index)
//            if (data.DAILY_DETAIL_ID == 'new') {
//                console.log('inmatch ', index)
//                $scope.gridOptions1.selectItem(index, true);
//            }
//        })
//    };
// MITE PUT BACK
    //ngGridEventData gets emitted after all functions in watch for data changes
    // $scope.$on('ngGridEventData', function () {
    //     $scope.gridOptions1.selectRow(0, true);
    // });
    $scope.createClaim = function () {
        $scope.claims.push({title: 'New Claim', description: 'Description pending.', criteria: 'Criteria pending.', status: 'Back Log', type: 'Feature', reporter: 'Pending', assignee: 'Pending'});
    };
    $scope.createDaily = function () {
        var rowLen;
        var e = $scope.$on('ngGridEventData', function() {
            $scope.gridOptions1.selectItem(rowLen-1, true);
            e();
        });
        //'5/28/2013'
//        rowLen= $scope.daily.push({DAILY_DETAIL_ID: 'new',DAILY_ID_: 0, WORK_DATE: $scope.form.SET_WORK_DATEDEFSHORT, WORK_TIME: '.10', WORK_DESCRIPTION: 'Work Description pending.', MILEAGE: '0', CLAIM_NO: $scope.currentClaimNo ,AR_ID:"null",SERVICE_ID:"null",EXPENSE_TYPE_ID:"null"});
//        $scope.currentDaily = {DAILY_DETAIL_ID: 'new',DAILY_ID_: 0, WORK_DATE: $scope.form.SET_WORK_DATEDEFSHORT, WORK_TIME: '.10', WORK_DESCRIPTION: 'Work Description pending.', MILEAGE: '0', CLAIM_NO: $scope.currentClaimNo ,AR_ID:"null",SERVICE_ID:"null",EXPENSE_TYPE_ID:"null"};
//        $scope.currentDaily.SERVICE_ID = null;
//        $scope.currentDaily.EXPENSE_TYPE_ID = null;
        rowLen= $scope.daily.push({DAILY_DETAIL_ID: 'new',DAILY_ID_: 0, WORK_DATE: $scope.form.SET_WORK_DATEDEFSHORT, WORK_TIME: '.10', WORK_DESCRIPTION: 'Work Description pending.', MILEAGE: '0', EXPENSE: 0,CLAIM_NO: $scope.currentClaimNo ,AR_ID:"null"});
    //    $scope.currentDaily = {DAILY_DETAIL_ID: 'new',DAILY_ID_: 0, WORK_DATE: $scope.form.SET_WORK_DATEDEFSHORT, WORK_TIME: '.10', WORK_DESCRIPTION: 'Work Description pending.', MILEAGE: '0', EXPENSE: 0, CLAIM_NO: $scope.currentClaimNo ,AR_ID:"null"};
       // if($scope.model.activePaneId
       //  alert ($scope.model.activePaneId);
      //     rowLen= $scope.dailybydate.push({DAILY_DETAIL_ID: 'new',DAILY_ID_: 0, WORK_DATE: $scope.form.SET_WORK_DATEDEFSHORT, WORK_TIME: '.10', WORK_DESCRIPTION: 'Work Description pending.', MILEAGE: '0', EXPENSE: 0,CLAIM_NO: $scope.currentClaimNo ,AR_ID:"null"});

        $scope.currentService   = null;
        $scope.currentExpense   = null;
    };

//      if (currentDaily.DAILY_DETAIL_ID === 'new') {
//    currentDaily.DAILY_DETAIL_ID = obj.result;

    $scope.postDaily = function () {
        var   rowLen= $scope.daily.length;

//        $scope.daily[rowLen].servicedesc= $scope.currentDaily.service;
//        $scope.daily[rowLen].expensedesc= $scope.currentDaily.expense;

        masCrud.postDaily($scope.currentDaily);

          if ($scope.dailybydate.length>0 ) $scope.changeData ($scope.form)  ;

    }


    $scope.setCurrentStatus = function (status) {
        if (typeof $scope.currentClaim !== 'undefined') {
            $scope.currentClaim.status = status.name;
        }
    };
    $scope.setCurrentType = function (type) {
        if (typeof $scope.currentClaim !== 'undefined') {
            $scope.currentClaim.type = type.name;
        }
    };

    $scope.setCurrentService = function (service) {
        if (typeof $scope.currentDaily !== 'undefined') {
            $scope.currentDaily.service = service.name;
            $scope.currentDaily.SERVICE_ID = service.id;
         //   alert (service.id);
        }
    };
    $scope.setCurrentExpense = function (expense) {
        if (typeof $scope.currentDaily !== 'undefined') {
            $scope.currentDaily.expense = expense.name;
            $scope.currentDaily.EXPENSE_TYPE_ID = expense.id;
        }

    };


};
