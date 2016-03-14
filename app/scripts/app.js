'use strict';

var app = app || {};
// ngNonBindable to avoid conflicting with page's ng
var html = document.querySelector('html');
var body = document.body;
var bottomBar = document.createElement('div');
var struckDirective = document.createElement('div');
var LB = angular.module('LetsBrowse', []);

bottomBar.setAttribute('id', 'bottomBar');
bottomBar.innerHTML = 'LB: {{ message }}';
body.appendChild(bottomBar);

// struckDirective.setAttribute('struck-directive', '');
// body.appendChild(struckDirective, body.firstChild);


LB.controller('LetsBrowseCtrl', function($scope) {

  $scope.message = 'What\'s this?';
  // var taken = app.getTaken();
});

LB.directive('struckDirective', function() {
  return {
    restrict: 'EA',
    replace: false,
    template: '' + '<svg class="floatTL" viewBox="0 0 10 10">' +
      '<rect "x="0" y="0" width="10%" height="100%" style="fill:black;stroke:red;stroke-width:1px;opacity:.5"></svg>'
  };
});

// bootstrapping to avoid conflicting with page's ng
window.name = '';
html.setAttribute('ng-app', '');
html.setAttribute('ng-csp', '');
html.dataset.ngNonBindable = '';
body.dataset.ngController = 'LetsBrowseCtrl as ctrl';
angular.element(document)
  .ready(function() {
    angular.bootstrap(body, ['LetsBrowse']);
    console.log('Bootstrap success! (fina-fucking-ly)');
  });

// 'use strict';

// var html = document.querySelector('html');
// var body = document.body;
// var bottomBar = document.createElement('div');

// var app = angular.module('LetsBrowse', []);

// html.setAttribute('ng-app', '');
// html.setAttribute('ng-csp', '');
// html.dataset.ngNonBindable = '';

// body.dataset.ngController = 'LetsBrowseCtrl as ctrl';
// body.appendChild(bottomBar);
// body.setAttribute('highlight-directive','');

// bottomBar.innerHTML = 'Angular says: {{ message }}';
// bottomBar.setAttribute('id', 'bottomBar');

// app.controller('LetsBrowseCtrl', function($scope) {
//   $scope.message = 'View curated by etc etc';
// });

// app.directive('highlightDirective', function($document) {
//   return {
//     link: function(scope, element, attribute) {
//       element.on('mouseenter', mouseenter);
//       element.on('mouseleave', mouseleave);

//       function mouseenter(event) {
//         console.log(event.target);
//         event.target.style.backgroundColor = 'rgb(250,150,50)';
//         event.target.on('mouseleave', mouseleave);
//       }

//       function mouseleave(event) {
//         event.target.style.backgroundColor = 'rgb(0,0,0)';
//         event.target.off('mouseleave');
//       }
//     }
//   };
// });

// window.name = '';
// angular.element(document)
//   .ready(function() {
//     angular.bootstrap(body, ['LetsBrowse']);
//     console.log('Bootstrap success! (fina-fucking-ly)');
//   });

// // angular.element(document).on("mousemove", function(evt) {
// //   evt.target.style.backgroundColor = 'rgb(250,150,50)';
// //   console.dir(evt.target);
// //   console.log(evt.target);
// // });

// // var overlayDirective = document.createElement('div');

// // body.appendChild(overlayDirective, body.firstChild);

// // app.directive('overlayDirective', function() {
// //   return {
// //     restrict: 'EA',
// //     replace: false,
// //     template: '' + '<svg class="floatTL" viewBox="0 0 10 10">' +
// //       '<rect "x="0" y="0" width="100%" height="100%" style="fill:black;stroke:red;stroke-width:1px;opacity:.5"></svg>'
// //   };
// // });

// // overlayDirective.setAttribute('overlay-directive', '');
