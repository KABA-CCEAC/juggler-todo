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
    add: function() {

      // push todos collection view to content
      app.push({
        views: {
          content: new module.Views.Add(),
          title: new app.Bars.Title({
            title: 'Add Todo',
            next: false
          })
        }
      });
    }
  });
  module.controller = new Controller();

  var Router = ns.Router.extend({
    appRoutes: {
      'add': 'add'
    },
    
    controller: module.controller
  });
  var router = new Router();


  /**************
  * ViEW
  */
  module.Views.Add = ns.ItemView.extend({
    tagName: 'div',
    template: 'todo/add',

    events: {
      'click .btnAdd': 'onAdd'
    },

    onAdd: function(e) {
      if (e) e.preventDefault();

      // a function to generate a pseudo guid
      function GUID() {
        var S4 = function () {
          return Math.floor( Math.random() * 0x10000 /* 65536 */ ).toString(16);
        };

        return (
          S4() + S4() + "-" +
          S4() + "-" +
          S4() + "-" +
          S4() + "-" +
          S4() + S4() + S4()
        );
      }

      // create a new todo
      var model = new data.Models.Todo({
        id: GUID(),
        title: this.$('.todoTitle').val(),
        state: 'open'
      });

      // save and append it on success
      model.save(null, {
        success: function() {
          app.store.get('todos').push(model);
        }
      });

      // naviate back
      app.pop();

    }
  });

});