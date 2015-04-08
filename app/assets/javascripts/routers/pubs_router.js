Large.Routers.PubsRouter = Backbone.Router.extend({
  routes: {
    "publications/new": "newPub",
    "publications/:id": "showPub",
    "publications/:id/edit": "editPub"
  },

  initialize: function (options) {
    this.collection = new Large.Collections.Publications();
    this.$rootEl = options.content
  },

  newPub: function () {
    var publication = new Large.Models.Publication();
    var pubNew = new Large.Views.NewPub({ collection: this.collection, model: publication });
    this._swapView(pubNew);
  },

  showPub: function (id) {
    var pub = this.collection.getOrFetch(id);
    var showPub = new Large.Views.PubShow({ pub: pub, publications: this.collection });
    this._swapView(showPub);
  },

  editPub: function (id) {
    var pub = this.collection.getOrFetch(id);
    var editPub = new Large.Views.PubEdit({ pub: pub });
    this._swapView(editStory)
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }
});
