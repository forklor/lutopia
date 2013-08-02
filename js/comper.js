$(function() {

	function repeater(str) {
		str += '';
		if (str.indexOf('-') > 0) {
			var bounds = str.split('-').map(function(i) { return parseInt(i, 10); });
			return Math.floor(Math.random() * (bounds[1] - bounds[0]) + bounds[0]); 
		} else {
			return parseInt(str, 10);
		}
	};

	$('[data-comper-repeat]').each(function() {
		var repeat = repeater($(this).data('comper-repeat'));
		for (var i = 0; i < repeat; i++) {
			$(this).after($(this).clone());
		}
	});

	// data-comper-lorem: 2 paragraphs, 2-10 words, 100 letters
	$('[data-comper-lorem]').each(function() {
		var lorem = $(this).data('comper-lorem').split(' ');
		var count = repeater(lorem[0]);
		var str = '';
		for (var i = 0; i < count; i++) {
			switch(lorem[1]) {
				case 'letters':
					str+= 'a';
					break;
				case 'words':
					str += ' căcat';
					break;
				case 'paragraphs':
					str += '<p>Lorem ipsum dolor sin amet.</p>';
					break;
			}
		}
		if (lorem[1] === 'words') {
			str += '.'; // finish the sentence;
		}
		$(this).html(str);
	});
});
