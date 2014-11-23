/*
	********************
		Main Script
	********************
*/


	
	/* 
		Events
	*/


		/* Start button */

		start_button.addEventListener('click', function (e)
		{
			// Reset draw
			drawn = false;

			// Set upload option to true
			upload = true;
			storage.url = image_input.value;

			// Go to precision section
			goToSection(2);

			return false;
		});


		/* Image input */

		image_input.addEventListener("keypress", removeError);


		/* List button clicked */

		var list_open = false;
		list_button.addEventListener('click', function (e)
		{
			if(list_open){
				hosted_images.className = "";
				list_open = false;
			}else{
				hosted_images.className = "active";
				list_open = true;
			}
		});


		/* List item clicked */

		var hosted_urls = hosted_images.getElementsByTagName("LI");
		for(var i=0; i<hosted_urls.length; i++)
		{
			hosted_urls[i].addEventListener('click', function(e)
			{
				// Drawn
				drawn = false;

				// Get Url
				var url = this.getAttribute("attr-url");
				storage.url = url;

				// Go to precision section
				goToSection(2);

				// Get image dimensions
				// getImageDimensions(url);
			});
		}


		/* Precision button clicked */

		var precision_button = precision_buttons.getElementsByTagName("BUTTON");
		for(var i=0; i<precision_button.length; i++){
			precision_button[i].addEventListener('click', function (e)
			{
				// Get precision
				var precision = this.getAttribute('data-precision');
				config.density = parseInt(precision);

				// Go to loading section
				goToSection(3);

				// Start process
				if(upload){
					uploadImage(storage.url);
				}else{
					getImageDimensions(storage.url);
				}

			});
		}


		/* Process Thread message */

		process.addEventListener('message', function (message)
		{
			// Storage
			storage.dimensions = message.data.params.dimensions;
			storage.rounds = message.data.params.rounds;
			// Go To draw section
			goToSection(4);

			// Wait for animation end
			var draw_interface = document.getElementsByClassName('fourth')[0];
			draw_interface.addEventListener('transitionend', function (e)
			{
				if(e.propertyName == "top" && drawn == false)
				{
					// Shedudle rounds animations
					shedudle = new Array(storage.rounds.length);
					for(var k=storage.rounds.length-1; k>=0; k--)
					{
						shedudle[k] = (Math.abs(k-storage.rounds.length)-1)*(config.animation.duration*0.1);
					}
					totalDuration = shedudle[0] + config.animation.duration;

					// Set drawing state to draw
					drawn = true;

					// Start animation
					window.requestAnimationFrame(drawImage);
				}
			});
		});


		/* Restart button clicked */

		restart_button.addEventListener("click", function (e)
		{
			// Reset variables to 0 state
			storage.rounds = null;
			storage.dimensions = null;
			storage.url = null;
			timing = 0;
			shedudle = null;
			totalDuration = 0;
			upload = false;

			// Reset DOM
			image_input.value = "";
			draw_interface_buttons.className = "";
			image_error.className = "error";
			hosted_images.className = "";
			list_open = false;

			// Return to first section 
			goToSection(1);

			return false;
		});




	/*
		Image Processing
	*/


		/* Image Upload */

		function uploadImage (url)
		{
			// Checking text presence in input
			if(url)
			{
				// Ajax call to upload script
				var params = "url=" + url;
				var req = new XMLHttpRequest();
				req.open("POST", config.baseurl + "upload.php", true);
				req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				req.onreadystatechange = function (e)
				{
					if(req.readyState == 4)
					{
						// AJAX Call worked
						var data = JSON.parse(req.responseText);
						if(data.success)
						{
							getImageDimensions(data.image);
						}
						else
						{
							// Send eror message
							goToSection(1);
							sendError(data.message);
						}
					}
				}
				req.send(params);
			}
			else
			{
				sendError("Vous devez spécifier l'url d'une image");
			}
		}


		/* Get image relative dimensions to window dimensions*/

		function getImageDimensions (url)
		{
			// Load image
			var image = new Image();
			image.onload = function ()
			{
				// Create a fake canvas
				var tool = {
					canvas : document.createElement('canvas')
				};
				tool.ctx = tool.canvas.getContext('2d');

				// Calculation of the dominant dimension
				var dimensions = {};
				if((config.drawingArea.width/image.width) > (config.drawingArea.height/image.height))
				{
					// Height
					dimensions.height = config.drawingArea.height;
					dimensions.offsetY = 0;
					dimensions.width = (image.width/image.height)*dimensions.height;
					dimensions.offsetX = (config.drawingArea.width - dimensions.width)/2;
				}
				else
				{
					// Width
					dimensions.width = config.drawingArea.width;
					dimensions.offsetX = 0;
					dimensions.height = (image.height/image.width)*dimensions.width;
					dimensions.offsetY = (config.drawingArea.height - dimensions.height)/2;
				}

				// Setting drawing canvas dimensions
				canvas.width = dimensions.width;
				canvas.height = dimensions.height;
				canvas.style.width = dimensions.width + "px";
				canvas.style.height = dimensions.height + "px";
				canvas.style.top = dimensions.offsetY + "px";
				canvas.style.left = dimensions.offsetX + "px";

				// Setting fake canvas dimensions
				tool.canvas.width = dimensions.width;
				tool.canvas.height = dimensions.height;
				tool.canvas.style.width = dimensions.width + "px";
				tool.canvas.style.height = dimensions.height + "px";
				tool.ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);

				// Get image datas
				getImageDatas(url, dimensions, tool);
			};

			// Set image url
			image.src = config.baseurl + url;
		}


		/* Get pixels data of the image */

		function getImageDatas(url, dimensions, tool)
		{
			// Get pixels data
			var pixels = tool.ctx.getImageData(0, 0, tool.canvas.width, tool.canvas.height);
			
			// Ask worker for analyse of pixels
			process.postMessage({
				event: "analyseImageDatas",
				params: {
					dimensions: dimensions,
					pixels: pixels,
					density: config.density
				}
			});
		}


		/* Draw image */

		function drawImage ()
		{
			if(timing < totalDuration)
			{
				// Clear canvas
				ctx.clearRect(0, 0, storage.dimensions.width, storage.dimensions.height);

				// Browse rounds
				for(var i=0; i<storage.rounds.length; i++)
				{
					//var i = 18;
					if(timing >= shedudle[i])
					{
						for(var j=0; j<storage.rounds[i].length; j++)
						{
							// Get the "round" object
							var round = storage.rounds[i][j];

							// Draw round
							drawRound(round, ctx);

							// Animate
							if(round.animation < round.position.y*config.density)
							{
								storage.rounds[i][j].animation = Math.easeInCubic(timing, 0, round.position.y*config.density, config.animation.duration);
							}else{
								storage.rounds[i][j].animation = round.position.y*config.density;
							}
						}
					}
				}

				// Set new timing
				timing++;

				// Call animation frame
				window.requestAnimationFrame(drawImage);
			}else{
				// Set download button
				var dataURL = canvas.toDataURL();
				save_button.href = dataURL;

				// Show buttons
				draw_interface_buttons.className = "active";
			}
		}





	/*
		Helper
	*/


		/* Easing function  */

		Math.easeInCubic = function (t, b, c, d) {
			t /= d;
			return c*t*t*t + b;
		};


		/* Draw round */

		function drawRound(round, ctx)
		{
			ctx.beginPath();
			ctx.fillStyle = "rgb(" +
				parseInt(round.color.r) + "," +
				parseInt(round.color.g) + "," +
				parseInt(round.color.b) + ")";
			ctx.arc((round.position.x*config.density) + config.density/2, round.animation + config.density/2, (config.density-2)/2, 0, 2 * Math.PI, false);
			ctx.fill();
		}




