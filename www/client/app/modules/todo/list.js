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
  module.Models.Todo = ns.Model.extend();

  module.Collections.Todos = ns.Collection.extend({

    // where to load the data from
    url: function() { return app.dataHost + "/todos"; }, 

    model: module.Models.Todo,

    // override the sync methode to use jsonp
    // you could override this globally on bigger apps
    // by overriding Backbone.sync
    sync: function(method, model, options) {
      options.dataType = "jsonp";  
      return Backbone.sync(method, model, options);  
    },

    // parse the inner array todos
    parse: function(data) {
      return data.todos;
    }
  });

  /**************
  * CONTROLLER
  */
  var Controller = ns.Controller.extend({
    todos: function() {

      // get or create todos collection
      // and fetch data
      var todos = app.store.get('todos');

      if (todos) {
        todo.fetchNew();
      } else {
        todos = new module.Collections.Todos();
        todos.fetch({
          success: function() {
            app.store.set('todos', todos);
          }
        });
      }

      // push todos collection view to content
      app.push({
        views: {
          content: new module.Views.Todos({
            collection: todos
          }),
          title: new app.Bars.Title({
            title: 'Todos',
            back: false,
            next: false
          })
        }
      });
    }
  });
  module.controller = new Controller();

  var Router = ns.Router.extend({
    appRoutes: {
      '': 'todos', /* basically this will be the entry page */
      'todos': 'todos'
    },
    
    controller: module.controller
  });
  var router = new Router();


  /**************
  * ViEW
  */
  module.Views.Todo = ns.ItemView.extend({
    tagName: 'li',
    template: 'todo/list_item'
  });

  module.Views.Todos = ns.CollectionView.extend({
    tagName: 'ul',
    className: 'list',
    itemView: module.Views.Todo
  });

});