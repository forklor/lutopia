var Lu = Ember.Application.create({
	applicationController: Ember.Controller.create({
		currentPathDidChange: function() {
			console.info(this.get('currentPath'));
		}
	})
});

Lu.Store = DS.Store.extend({
	revision: '13',
	adapter: DS.FixtureAdapter.create()
});

Lu.Router.map(function() {
	this.route('story');
	this.resource('galleries', { path: 'gallery' }, function() {
		this.route('index', { path: '/' });
		this.resource('gallery', { path: '/:slug'}, function() {
			this.route('index', { path: '/' });
		});
		// this.resource('gallery', { path: '/gallery/:id' }, function() {
		// 	this.route('index', { path: '/' });
		// 	this.resource('galleryItem', { path: '/:id' });
		// });
	});
	this.resource('draw', function() {
		this.route('index')
		this.route('gallery');
	});

	this.route('blog');
});

Lu.GalleriesRoute = Ember.Route.extend({
	model: function() {
		return Lu.Gallery.find();
	}
});

Lu.GalleriesGalleryRoute = Ember.Route.extend({
	model: function(params) {
		console.log(params);
		return Lu.Gallery.find(params.slug);
	},
	serialize: function(model) {
		return {
			slug: model.get('slug')
		};
	}
});

Lu.GalleriesGalleryIndexRoute = Ember.Route.extend({
	model: function (params) {
		console.log(params);
		return Lu.Gallery.find(params.slug);
	},
	serialize: function(model) {
		return { slug: model.get('slug') };
	}
});

Lu.GalleriesGalleryDetailRoute = Ember.Route.extend({
	model: function(params) {
		return Lu.GalleryItem.find(params.id);
	}
});

Lu.DrawIndexView = Ember.View.extend({
	didInsertElement: function(){
		brush.init({
			canvas: $("#artboard")[0],
			palette: $("#palette")[0],
			width: 800,
			height: 600
		});
	}
});