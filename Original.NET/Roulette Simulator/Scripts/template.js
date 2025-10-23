/**
Game Engine object
**/
var Game = function () {

    // initializes main settings
    var handleInit = function () {

    };

    return {

        //main function to initiate the theme
        init: function () {

            handleInit(); // initialize core settings           
        }

    };

}();


jQuery(document).ready(function () {
    Game.init();
});



//////////// ANGULAR 
(function () {

    'use strict';

    // Exam details page
    function templateController($scope, $sce, $http, examRepository, titleCodeRepository) {

        var vm = this;

        vm.someVariable = true;

        // Some function
        vm.someFunction = function () {
            return true;
        };
    }

    var examsApp = angular.module('examsApp', ['ngResource', 'ngSanitize']);
    examsApp.directive('somedirective', [someDirective]);    
    examsApp.filter('somefilter', [someFilter]);    
    examsApp.factory('ExamRepository', ['$resource', ExamRepository]);
    examsApp.controller('templateController', ['$scope', '$sce', '$http', templateController]);

})();