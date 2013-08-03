var Lu = {
	goTo: function(route) {
		$("#" + route + "-section").show().siblings('section').hide();
	}
};

Lu.Router = Backbone.Router.extend({
	routes: {
		'story': 'goo',
		'gallery': 'goo',

		goo: function(route) {
			console.log(route);
			Lu.goTo(route);
		}
	}
});

Lu.router = new Lu.Router();

Backbone.history.start();

$(function() {
	$('nav a').on('click', function() {
		var route = $(this).attr('href').split('#')[1];
		Lu.router.navigate(route, true);
		return false;
	});

	brush.init({
		canvas: $("#artboard")[0],
		palette: $("#palette")[0],
		width: 1200,
		height: 600
	});

	$("#draw-section").on('click', '#download-drawing', function() {
		brush.download();
		return false;
	});
})