define([
  'namespace'
],

function(ns) {
  var app = ns.app;

  // Create a new module
  var module = ns.module();

  /**************
  * MODEL
  */
  module.Models.Todo = ns.Model.extend({
    url: function() { return app.dataHost + "/todo/" + this.id; }
  });

  module.Collections.Todos = ns.Collection.extend({

    // where to load the data from
    url: function() { return app.dataHost + "/todos"; }, 

    model: module.Models.Todo,

    // parse the inner array todos
    parse: function(data) {
      return data.todos;
    }
  });

  return module;

});