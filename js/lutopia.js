var Lu = {};

$(function() {

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