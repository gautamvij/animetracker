

var directiveModule = angular.module('angularjs-dropdown-multiselect', []);

directiveModule.directive('ngDropdownMultiselect', ['$filter', '$document', '$compile', '$parse',
    function ($filter, $document, $compile, $parse) {
        'use strict';
        return {
            restrict: 'AE',
            scope: {
                selectedModel: '=',
                options: '=',
                extraSettings: '=',
                events: '=',
                searchFilter: '=?',
                translationTexts: '=',
                groupBy: '@'
            },
            template: function (element, attrs) {
                var checkboxes = attrs.checkboxes ? true : false;
                var groups = attrs.groupBy ? true : false;
                //  
                var template = '<div>';
                template += '<button type="button"  ng-class="settings.buttonClasses" >{{getButtonText()}}&nbsp;<span class="caret"></span></button>';
                // 
                template += '<ul class="dropdown"  >';
                template += '<li ng-show="settings.showUncheckAll"><a class="dropmenu" data-ng-click="deselectAll();"><span class="glyphicon glyphicon-remove"></span>   {{texts.uncheckAll}}</a></li>';
                template += '<li ng-show="settings.enableSearch"><input type="text"  style="width: 100%;" ng-model="searchFilter" placeholder="{{texts.searchPlaceholder}}" /></li>';
                template += '<li ng-show="settings.enableSearch"></li>';
                template += '<li  ng-repeat="option in options | filter: searchFilter">';
                template += '<a class="dropmenu" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))">';
                // paste the class for the tick button to be shown here 
                template += '<span data-ng-class=\'tick\' ng-show="isChecked(getPropertyForObject(option,settings.idProp))">&#10004;</span> {{getPropertyForObject(option, settings.displayProp)}}</a>';
                template += '</li>';
                template += '</ul>';
                template += '</div>';

                element.html(template);
            },
            link: function ($scope, $element, $attrs) {
                var $dropdownTrigger = $element.children()[0];
                
                $scope.toggleDropdown = function () {
                    debugger;
                    $scope.random.open = !$scope.random.open;
                };

                $scope.checkboxClick = function ($event, id) {
                    $scope.setSelectedItem(id);
                    $event.stopImmediatePropagation();
                };

                $scope.externalEvents = {
                    onItemSelect: angular.noop,
                    onItemDeselect: angular.noop,
                    onSelectAll: angular.noop,
                    onDeselectAll: angular.noop,
                    onInitDone: angular.noop,
                    onMaxSelectionReached: angular.noop
                };

                $scope.settings = {
                    dynamicTitle: true,
                    scrollable: false,
                    scrollableHeight: '300px',
                    closeOnBlur: true,
                    displayProp: 'label',
                    idProp: 'id',
                    externalIdProp: 'id',
                    enableSearch: false,
                    selectionLimit: 0,
                    showCheckAll: true,
                    showUncheckAll: true,
                    closeOnSelect: false,
                    buttonClasses: 'btn btn-default',
                    closeOnDeselect: false,
                    groupBy: $attrs.groupBy || undefined,
                    groupByTextProvider: null,
                    smartButtonMaxItems: 0,
                    smartButtonTextConverter: angular.noop
                };

                $scope.texts = {
                    checkAll: 'Check All',
                    uncheckAll: 'Uncheck All',
                    selectionCount: 'checked',
                    selectionOf: '/',
                    searchPlaceholder: 'Search...',
                    buttonDefaultText: 'Select',
                    dynamicButtonTextSuffix: 'checked'
                };

                $scope.searchFilter = $scope.searchFilter || '';

                if (angular.isDefined($scope.settings.groupBy)) {
                    $scope.$watch('options', function (newValue) {
                        if (angular.isDefined(newValue)) {
                            $scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
                        }
                    });
                }

                angular.extend($scope.settings, $scope.extraSettings || []);
                angular.extend($scope.externalEvents, $scope.events || []);
                angular.extend($scope.texts, $scope.translationTexts);

                $scope.singleSelection = $scope.settings.selectionLimit === 1;

                function getFindObj(id) {
                    var findObj = {};

                    if ($scope.settings.externalIdProp === '') {
                        findObj[$scope.settings.idProp] = id;
                    } else {
                        findObj[$scope.settings.externalIdProp] = id;
                    }

                    return findObj;
                }

                function clearObject(object) {
                    for (var prop in object) {
                        delete object[prop];
                    }
                }

                if ($scope.singleSelection) {
                    if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0) {
                        clearObject($scope.selectedModel);
                    }
                }

                if ($scope.settings.closeOnBlur) {
                    $document.on('click', function (e) {
                        var target = e.target.parentElement;
                        var parentFound = false;

                        while (angular.isDefined(target) && target !== null && !parentFound) {
                            if (_.includes(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                                if(target === $dropdownTrigger) {
                                    parentFound = true;
                                }
                            }
                            target = target.parentElement;
                        }

                        if (!parentFound) {
                            $scope.$apply(function () {
                                $scope.random = {open : false } ;
                            });
                        }
                    });
                }

                $scope.getGroupTitle = function (groupValue) {
                    if ($scope.settings.groupByTextProvider !== null) {
                        return $scope.settings.groupByTextProvider(groupValue);
                    }

                    return groupValue;
                };

                $scope.getButtonText = function () {
                    if ($scope.settings.dynamicTitle && ($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) && _.keys($scope.selectedModel).length > 0))) {
                        if ($scope.settings.smartButtonMaxItems > 0) {
                            var itemsText = [];

                            angular.forEach($scope.options, function (optionItem) {
                                if ($scope.isChecked($scope.getPropertyForObject(optionItem, $scope.settings.idProp))) {
                                    var displayText = $scope.getPropertyForObject(optionItem, $scope.settings.displayProp);
                                    var converterResponse = $scope.settings.smartButtonTextConverter(displayText, optionItem);

                                    itemsText.push(converterResponse ? converterResponse : displayText);
                                }
                            });

                            if ($scope.selectedModel.length > $scope.settings.smartButtonMaxItems) {
                                itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
                                itemsText.push('...');
                            }

                            return itemsText.join(', ');
                        } else {
                            var totalSelected;

                            if ($scope.singleSelection) {
                                totalSelected = ($scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
                            } else {
                                totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;
                            }

                            if (totalSelected === 0) {
                                return $scope.texts.buttonDefaultText;
                            } else {
                                return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix;
                            }
                        }
                    } else {
                        return $scope.texts.buttonDefaultText;
                    }
                };

                $scope.getPropertyForObject = function (object, property) {
                    if (angular.isDefined(object) && object.hasOwnProperty(property)) {
                        return object[property];
                    }

                    return '';
                };

                $scope.selectAll = function () {
                    $scope.deselectAll(false);
                    $scope.externalEvents.onSelectAll();

                    angular.forEach($scope.options, function (value) {
                        $scope.setSelectedItem(value[$scope.settings.idProp], true);
                    });
                };

                $scope.deselectAll = function (sendEvent) {
                    sendEvent = sendEvent || true;

                    if (sendEvent) {
                        $scope.externalEvents.onDeselectAll();
                    }

                    if ($scope.singleSelection) {
                        clearObject($scope.selectedModel);
                    } else {
                        $scope.selectedModel.splice(0, $scope.selectedModel.length);
                    }
                };

                $scope.setSelectedItem = function (id, dontRemove) {
                    var findObj = getFindObj(id);
                    var finalObj = null;

                    if ($scope.settings.externalIdProp === '') {
                        finalObj = _.find($scope.options, findObj);
                    } else {
                        finalObj = findObj;
                    }

                    if ($scope.singleSelection) {
                        clearObject($scope.selectedModel);
                        angular.extend($scope.selectedModel, finalObj);
                        $scope.externalEvents.onItemSelect(finalObj);
                        if ($scope.settings.closeOnSelect) {
                            debugger
                            $scope.random.open = false;

                        }

                        return;
                    }

                    dontRemove = dontRemove || false;

                    var exists = _.findIndex($scope.selectedModel, findObj) !== -1;

                    if (!dontRemove && exists) {
                        $scope.selectedModel.splice(_.findIndex($scope.selectedModel, findObj), 1);
                        $scope.externalEvents.onItemDeselect(findObj);
                    } else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
                        $scope.selectedModel.push(finalObj);
                        $scope.externalEvents.onItemSelect(finalObj);
                    }
                    if ($scope.settings.closeOnSelect) {
                        debugger
                        $scope.random.open = false;
                    }
                };

                $scope.isChecked = function (id) {
                    if ($scope.singleSelection) {
                        return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp]) && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
                    }

                    return _.findIndex($scope.selectedModel, getFindObj(id)) !== -1;
                };

                $scope.externalEvents.onInitDone();
            }
        };
}]);

