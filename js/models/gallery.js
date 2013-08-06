Lu.Gallery = DS.Model.extend({
	items: DS.hasMany('Lu.GalleryItem'),
	title: DS.attr('string'),
	counter: DS.attr('string'),
	slug: function() {
		return this.get('title').toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/[\s]+/g, '-');
	}.property('title')
});

Lu.Gallery.FIXTURES = [

	{ id: 1, counter: 'A', title: "Tom's Drawings", items: [1,2,3,4] },
	{ id: 2, counter: 'B', title: "Unique Series", items: [1,2,3,4] }

];