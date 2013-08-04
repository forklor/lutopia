var Lu = Ember.Application.create();

Lu.Store = DS.Store.extend({
	revision: '13',
	adapter: DS.FixtureAdapter.create()
});

Lu.Router.map(function() {
	this.route('story');
	this.route('gallery');
	this.route('draw');
});

Lu.GalleryRoute = Ember.Route.extend({
	model: function() {
		return Lu.LutopianGalleryItem.find();
	},
	setupController: function(controller, model) {
		controller.set('model', model);
	}
});

Lu.DrawView = Ember.View.extend({
	didInsertElement: function(){
		brush.init({
			canvas: $("#artboard")[0],
			palette: $("#palette")[0],
			width: 800,
			height: 600
		});
	}
});