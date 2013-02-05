define([
  'namespace',
  './data'
],

function(ns, data) {
  var app = ns.app;

  // Create a new module
  var module = ns.module();

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
        todos = new data.Collections.Todos();
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
            next: 'add',
            nextTarget: 'add',
            nextClass: 'button'
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