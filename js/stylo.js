var requestAnimationFrame = 
	window.requestAnimationFrame || 
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || 
	window.msRequestAnimationFrame || 
	function(callback) {
		return window.setTimeout.call(window, callback, 40);
	};

var brush = {
	MIN_BRUSH_SIZE: 1,
	MAX_BRUSH_SIZE: 60,
	canvasWidth: 800,
	canvasHeight: 600,

	splatter: false,

	SPLATTER_MAX: 1.5,
	SPLATTER_MIN: 0.1,
	SPLATTER_PROBABILITY: 0.05,

	MIN_DISTANCE: 1,
	MAX_DISTANCE: 200,

	brushColor: "rgba(0, 0, 0, 0.75)",

	colors: [
		'rgba(255, 255, 255, 0.75)', 
		'rgba(0, 0, 0, 0.75)', 
		'rgba(46, 204, 113, 0.75)',
		'rgba(52, 152, 219, 0.75)',
		'rgba(44, 62, 80, 0.75)',
		'rgba(50, 74, 178, 0.75)',
		'rgba(200, 0, 0, 0.75)', 
		'rgba(200, 150, 0, 0.75)'],

	tick: function() {
		brush.draw();
	},

	init: function(opts) {

		opts = opts || {};

		this.canvas = opts.canvas;
		this.context = this.canvas.getContext("2d");

		if (opts.width) this.canvasWidth = opts.width;
		if (opts.height) this.canvasHeight = opts.height;

		$(this.canvas)
			.on('mousedown touchstart', function(e) { brush.start(e); })
			.on('mousemove touchmove', function(e) { brush.readCoords(e); })
			.on('mouseup mouseout touchend touchleave', function(e) { brush.stop(e); });

		this.palette = opts.palette;
		var $palette = $(this.palette);

		$palette.on('click', '[data-color]', function() {
			var color = $(this).data('color');
			brush.setColor(color);
		});

		var colors = '';
		for (var i = 0; i < this.colors.length; i++) {
			colors += '<li data-color="' + this.colors[i] + '" style="display:inline-block;width:3em;height:3em;background-color:' + this.colors[i] + '"></li>';
		}

		$palette.css({
			'text-align': 'center'
		}).html(colors);
		$(window).on('scroll resize', function() {
			brush.adjustBox();
		});
		this.adjustCanvas();
		this.adjustBox();
	},

	adjustCanvas: function(){
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;
	},

	adjustBox: function() {
		this.box = this.canvas.getBoundingClientRect();
	},

	start: function(e) {
		this.prevX = this.currentX;
		this.prevY = this.currentY;
		this.prevPoint1 = this.prevPoint2 = {x: this.prevX, y: this.prevY };
		this.prevBrushSize = this.MIN_BRUSH_SIZE;
		this.prevMouseVector = null;
		// this.context.lineCap = 'round';
		this.context.strokeStyle = this.brushColor;
		this.context.fillStyle = this.brushColor;
		this.context.lineWidth = 0.25;
		this.started = true;
		window.requestAnimationFrame(this.tick);
	},
	draw: function() {
		if (!this.started) return;
		if (this.prevX !== this.currentX || this.prevY !== this.currentY) {
			var mouseDistance = Math.sqrt(Math.pow(this.currentX - this.prevX, 2) + Math.pow(this.currentY - this.prevY, 2));

			var distanceRatio = (mouseDistance - this.MIN_DISTANCE) / (this.MAX_DISTANCE - this.MIN_DISTANCE); // [0-1]
			var brushSize =  distanceRatio * (this.MAX_BRUSH_SIZE - this.MIN_BRUSH_SIZE) + this.MIN_BRUSH_SIZE;
			var mouseVector = {
				x: (this.currentX - this.prevX) / mouseDistance,
				y: (this.currentY - this.prevY) / mouseDistance
			};

			// perpendicular
			var vector = { x: -mouseVector.y, y: mouseVector.x };

			var prevDist = this.prevBrushSize;
			var dist = brushSize;

			var point1 = { x: (this.currentX + vector.x * brushSize / 2), y: (this.currentY + vector.y * brushSize / 2) };
			var point2 = { x: (this.currentX - vector.x * brushSize / 2), y: (this.currentY - vector.y * brushSize / 2) };

			var controlQ = mouseDistance / 4;

			var prevMouseVector = this.prevMouseVector || mouseVector;

			var prevPoint1Ctrl = {x: this.prevPoint1.x + prevMouseVector.x * controlQ, y: this.prevPoint1.y + prevMouseVector.y * controlQ };
			var prevPoint2Ctrl = {x: this.prevPoint2.x + prevMouseVector.x *controlQ, y: this.prevPoint2.y + prevMouseVector.y * controlQ };
			var point1Ctrl = {x: point1.x - mouseVector.x * controlQ, y: point1.y - mouseVector.y * controlQ };
			var point2Ctrl = {x: point2.x - mouseVector.x * controlQ, y: point2.y - mouseVector.y * controlQ };

			this.context.beginPath();
			this.context.moveTo(this.prevPoint1.x, this.prevPoint1.y);
			if (mouseDistance > 10) {
				this.context.bezierCurveTo(prevPoint1Ctrl.x, prevPoint1Ctrl.y, point1Ctrl.x, point1Ctrl.y, point1.x, point1.y);
			} else {
				this.context.lineTo(point1.x, point1.y);
			}
			this.context.lineTo(point2.x, point2.y);
			if (mouseDistance > 10) {
				this.context.bezierCurveTo(point2Ctrl.x, point2Ctrl.y, prevPoint2Ctrl.x, prevPoint2Ctrl.y, this.prevPoint2.x, this.prevPoint2.y);
			} else {
				this.context.lineTo(this.prevPoint2.x, this.prevPoint2.y);
			}
			this.context.lineTo(this.prevPoint1.x, this.prevPoint1.y);
			this.context.fill();
			this.context.closePath();
			this.context.beginPath();
			this.context.moveTo(this.prevPoint1.x, this.prevPoint1.y);
			this.context.lineTo(this.prevPoint2.x, this.prevPoint2.y);
			this.context.stroke();
			this.context.closePath();

			// drop a splatter
			var shouldSplatter = Math.random() < this.SPLATTER_PROBABILITY;
			if (this.splatter && shouldSplatter) {
				var splatter_points = Math.round(Math.random() * 3 + 1);
				for (var i = 0; i < splatter_points; i++) {
					var splatter_diameter = brushSize * (Math.random() * this.SPLATTER_MAX + this.SPLATTER_MIN);
					var splatter_offset = Math.random() * mouseDistance;
					var splatter_offset_perpendicular = Math.random() * brushSize / 2;
					var splatter_center = {
						x: this.prevX + mouseVector.x * splatter_offset + vector.x * splatter_offset_perpendicular,
						y: this.prevY + mouseVector.y * splatter_offset + vector.y * splatter_offset_perpendicular
					};

					this.context.beginPath();
					this.context.arc(splatter_center.x, splatter_center.y, splatter_diameter / 2, 0, 2 * Math.PI, false);
					this.context.fill();
					this.context.closePath();
				}
			}
			this.prevX = this.currentX;
			this.prevY = this.currentY;
			this.prevBrushSize = brushSize;
			this.prevPoint1 = point1;
			this.prevPoint2 = point2;
			this.prevMouseVector = mouseVector;
		}
		window.requestAnimationFrame(this.tick);
	},
	stop: function(e) {
		this.started = false;
	},
	setColor: function(color) {
		this.brushColor = color;
	},
	readCoords: function(e) {
		this.currentX = e.clientX - this.box.left;
		this.currentY = e.clientY - this.box.top;
	},
	download: function() {
		var url = this.canvas.toDataURL('image/png');
		window.open(url);
	}
};