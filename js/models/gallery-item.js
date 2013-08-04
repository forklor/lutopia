Lu.GalleryItem = DS.Model.extend({
	name: DS.attr('string'),
	description: DS.attr('string'),
	image: DS.attr('string'),
	date: DS.attr('string'),
	gallery: DS.belongsTo('Lu.Gallery')
});