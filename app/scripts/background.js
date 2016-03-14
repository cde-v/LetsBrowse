var app = app || {};

window.addEventListener('load', onLoad);

function injectAngular(tabId) {
  console.log("0");
  chrome.tabs.executeScript(tabId, { code: 'window.name = "NG_DEFER_BOOTSTRAP!" + window.name;' }, function() {
    console.log("1");
    chrome.tabs.executeScript(tabId, { file: '/bower_components/angular/angular.min.js' }, function() {
      console.log("2");
      chrome.tabs.executeScript(tabId, { file: '/scripts/app.js' }, function() {
        console.log("3");
      });
    });
  });
}

function onLoad() {
  chrome.browserAction.onClicked.addListener(function(tab) {
    injectAngular(tab.id);
    console.log('LOADED');
    chrome.tabs.executeScript(tab.id, { file: "/scripts/main.js" });
  });
}
