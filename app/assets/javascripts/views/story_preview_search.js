Large.Views.StoryPreviewSearch = Backbone.View.extend({
  template: JST['stories/story_preview_search'],

  initialize: function (options) {
    this.publications = options.publications;
    this.users = options.allUsers;

    // this.listenTo(Large.Collections.users, 'sync', this.render);
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.publications, 'sync', this.render);
  },

  render: function () {
    // debugger
    var pubId = this.model.get('pub_id');
    var pub = this.publications.get(pubId);

    var authorId = this.model.get('author_id');
    var author = this.users.get(authorId);
    // if (!author) {
    //   return this;
    // }
    var content = this.template({ story: this.model, author: author, pub: pub, authorId: authorId });
    this.$el.html(content);
    this.$("abbr.timeago").timeago();

    return this;
  }
});
