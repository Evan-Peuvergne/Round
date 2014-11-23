/*
	**********************
		Initialisation
	**********************
*/

	/*
		Variables
	*/


		/* DOM */

		var interface_container = document.getElementById("interface"),
			form_section = document.getElementById("section-form"),
			loader_section = document.getElementById("section-loader"),
			draw_section = document.getElementById("section-draw"),
			image_input = document.getElementById("input-image"),
			list_button = document.getElementById("btn-list"),
			hosted_images = document.getElementById("hosted-images"),
			image_error = document.getElementById("error-image"),
			start_button = document.getElementById("btn-start"),
			precision_buttons = document.getElementById("precision-buttons"),
			restart_button = document.getElementById("btn-reset"),
			save_button = document.getElementById("btn-save"),
			draw_interface_buttons = document.getElementById("canvas-buttons");


		/* Canvas */

		var canvas = document.getElementById("canvas-draw"),
			ctx = canvas.getContext('2d');


		/* Background Thread */

		var process = new Worker('src/js/process.js');


		/* Datas Storage */

		var storage = {
			rounds : null,
			dimensions: null,
			url: null
		};


		/* Animation */

		var timing = 0;
		var shedudle = null;
		var totalDuration = 0;


		/* Process */

		var drawn = false;
		var upload = false;


		/* Config */

		var config = {
			density: 6,
			baseurl: "http://" + window.location.host + "/Rounds/",
			drawingArea: {
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight
			},
			animation: {
				duration: 20
			}
		};

	
	/* 
		Set ups
	*/	


