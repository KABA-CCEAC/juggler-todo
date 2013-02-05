require([
  "namespace",

  // Libs
  "jquery",
  "backbone",

  // Modules
  //"modules/data/appData",
  //"modules/translate/resourceSync",

  // common
  //"modules/common/common",
  //"modules/layout/layout",

  // pages
  "modules/bars/bars",
  "modules/todo/views"
],

function(ns, $, Backbone) {

  // Shorthand the application namespace
  var app = ns.app;

  // turn on debugging
  app.debug = false;

  // more settings

  // don't forget to whitelist it
  // http://docs.phonegap.com/en/2.3.0/guide_whitelist_index.md.html#Domain%20Whitelist%20Guide
  app.dataHost = 'http://10.2.24.101:3000'; 

  // regions
  // you could add regions like this app.addRegions({});
  // or use stackRegions for transitioning
  app.stack.addStackRegion('content', '.content', {
    css: { position:'absolute', width: '100%' }
  });

  app.stack.addStackRegion('title', '.bar-title');
  app.stack.addStackRegion('header', '.bar-header');
  app.stack.addStackRegion('subheader', '.bar-header-secondary');
  app.stack.addStackRegion('tab', '.bar-tab');

  // initialize
  app.addAsyncInitializer(function(options, done) {
    if (app.isMobile && app.isUIWebView) {
      // This is running on a device so waiting for deviceready event
      document.addEventListener('deviceready', done);
    } else {
      // On desktop don't have to wait for anything
      done();
    }
  });

  app.start(function() {
    Backbone.history.start(/*{ pushState: true }*/);
  });

});