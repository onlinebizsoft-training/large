Large.Views.SearchShow = Backbone.CompositeView.extend({
  template: JST['search/search_show'],

  events: {
    "submit": "handleInput",
    "click .follow": "toggleFollow"
  },

  initialize: function (options) {
    this.currentUserFollows = options.follows;
    this.params = options.params;
    this.publications = options.publications;
    this.users = options.users;
    this.stories = options.stories;
    this.allUsers = options.allUsers;

    if (this.params !== null) {
      this.listenTo(this.currentUserFollows, 'sync', this.render);
      this.listenTo(this.publications, 'sync', this.render);
      this.listenTo(this.users, 'sync', this.render);
      this.listenTo(this.stories, 'sync add', this.render);
      this.listenTo(Large.Collections.users, 'sync', this.render);

      this.stories.models.forEach(this.addStoryView.bind(this));
      this.listenTo(this.stories, 'sync add', this.addStoryViews);
      this.listenTo(this.stories, 'remove', this.removeStoryViews);
    }
  },

  addStoryView: function (story) {
    var subviews = this.subviews('.results-previews');
    var i = _(subviews).findIndex(function (el) {
      return el.model === story;
    });

    if (i === -1) {
      var storyPreview = new Large.Views.StoryPreviewSearch({
        model: story, publications: this.publications, allUsers: this.allUsers
      });
      this.addSubview('.results-previews', storyPreview);
    }
  },

  removeStoryView: function (story) {
    var subviews = this.subviews('.results-previews');
    var i = _(subviews).findIndex(function (el) {
      return el.model === story;
    });
    if (i === -1) { return };

    subviews[i].remove();
    subviews.splice(i, 1);
  },

  addStoryViews: function () {
    this.stories.models.forEach(this.addStoryView.bind(this));
  },

  removeStoryViews: function () {
    this.stories.models.forEach(this.removeStoryView.bind(this));
  },

  relatedTags: function () {
    var tags = []
    var ids = []
    if (this.params !== null) {
      this.stories.forEach( function (story) {
        story.ttags().forEach( function (tag) {
          if (ids.indexOf(tag.id) === -1) {
            tags.push(tag);
            ids.push(tag.id)
          }
        })
      });

      this.publications.forEach( function (pub) {
        pub.ttags().forEach( function (tag) {
          if (ids.indexOf(tag.id) === -1) {
            tags.push(tag);
            ids.push(tag.id);
          }
        })
      });
    }
    return tags;
  },

  render: function () {
    // debugger
    $('.navbar').find('.new-story-header').remove();
    $('.navbar-nav').find('.about-link').remove();
    $('.navbar-nav').find('.user-edit-toggle').remove();

    var content = this.template({
      params: this.params,
      publications: this.publications,
      stories: this.stories,
      users: this.users,
      tags: this.relatedTags()
    });

    this.$el.html(content);
    this.attachSubviews();

    this.$('input[type=submit]').hide();

    $('.follow').each(function (i, obj) {
      var $id = parseInt($(obj).attr('id'));
      var $type = $(obj).val();
      var follow = this.currentUserFollows.findWhere({
                        followable_id: $id,
                        followable_type: $type });
      if (!!follow) {
        $(obj).data('follow-state', 'followed');
      } else {
        $(obj).data('follow-state', 'unfollowed');
      }
    }.bind(this));

    $('.follow').each(function (i, obj) {
      if ($(obj).data('follow-state') == "followed") {
        $(obj).html("Unfollow!");
      } else {
        $(obj).html("Follow!");
      }
    });

    this.$("abbr.timeago").timeago();
    return this;
  },

  handleInput: function () {
    var params = this.$('#box').val();
    Backbone.history.navigate();
    Backbone.history.navigate("search?" + params, { trigger: true });
  },

  toggleFollow: function (event) {
    var $id = parseInt($(event.currentTarget).attr('id'));
    var $type = $(event.currentTarget).val();
    var follow = this.currentUserFollows.findWhere({
                      followable_id: $id,
                      followable_type: $type });

    if (follow === undefined) {
      follow = new Large.Models.Follow( { followable_id: $id, followable_type: $type });
      follow.save(follow.attributes, {
        success: function () {
          $(event.currentTarget).data('follow-state', 'followed');
          $(event.currentTarget).html("Unfollow!");
        }
      });
    } else {
      follow.destroy({
        success: function (model, response) {
          $(event.currentTarget).data('follow-state', 'unfollowed');
          $(event.currentTarget).html("Follow!");
        }
      });
    }
  }

});
