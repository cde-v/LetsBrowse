// 'use strict';

// // ngNonBindable to avoid conflicting with page's ng
// var html = document.querySelector('html');
// var body = document.body;
// var bottomBar = document.createElement('div');
// var struckDirective = document.createElement('div');
// var app = angular.module('LetsBrowse', []);


// html.setAttribute('ng-app', '');
// html.setAttribute('ng-csp', '');
// html.dataset.ngNonBindable = '';

// body.dataset.ngController = 'LetsBrowseCtrl as ctrl';
// body.appendChild(bottomBar);
// body.appendChild(struckDirective, body.firstChild);

// bottomBar.innerHTML = 'Angular says: {{ message }}';
// bottomBar.setAttribute('id', 'bottomBar');

// app.controller('LetsBrowseCtrl', function($scope) {
//   $scope.message = 'Hello, isolated world !';
// });

// app.directive('struckDirective', function() {
//   return {
//     restrict: 'EA',
//     replace: false,
//     template: '' + '<svg class="floatTL" viewBox="0 0 10 10">' +
//       '<rect "x="0" y="0" width="100%" height="100%" style="fill:black;stroke:red;stroke-width:1px;opacity:.5"></svg>'
//   };
// });

// struckDirective.setAttribute('struck-directive', '');

// // bootstrapping to avoid conflicting with page's ng
// window.name = '';
// angular.element(document)
//   .ready(function() {
//     angular.bootstrap(body, ['LetsBrowse']);
//     console.log('Bootstrap success! (fina-fucking-ly)');
//   });


// body, html {
//     height: 100%;
//     width: 100%;
//     margin: 0;
//     padding: 0;
// }

// .floatTL {
//     position: fixed;
//     height: 100%;
//     width: 100%;
//     top: 0px;
//     left: 0px;
// }

// #bottomBar {
//     background: rgb(250, 150, 50);
//     bottom: 0px;
//     font-weight: bold;
//     position: fixed;
//     text-align: center;
//     width: 100%;
// }

