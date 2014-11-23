/*
	*************************
		Process Thread
	*************************
*/


	
	/* Event Dispatcher */

	function dispatcher(event)
	{
	   switch(event.data.event)
	   {
	   		case "analyseImageDatas":
	   			analyseImageDatas(event.data.params);
	   		break;
	   }
	}


	/* Events*/


		/* Analyse pixels datas */

		var pixels;
		function analyseImageDatas (datas)
		{
			// Store pixels
			pixels = datas.pixels;
			// Get rounds dimensions
			var roundsWidth = parseInt(pixels.width/datas.density);
			var roundsHeight = parseInt(pixels.height/datas.density);

			// Création of a blanc rounds array
			var rounds = new Array();
			for(var i=0; i<roundsHeight; i++){
				rounds[i] = new Array(roundsWidth);
			}


			/* On parcourt les rounds */
			for(var i=0; i<roundsHeight; i++)
			{
				rounds[i] = new Array();
				for(var j=0; j<roundsWidth; j++)
				{
					rounds[i][j] = {
						position: {
							x: j,
							y: i
						},
						animation: 0,
						color: getRoundColor(j, i, datas.density)
					};
				}
			}

			/* On attend un minimum de 3 secondes puis on envoie les données*/
			var that = this;
			setTimeout(function (){
				that.postMessage({
					event: "imageAnalyseFinished",
					params: {
						rounds: rounds,
						dimensions: datas.dimensions
					}
				});
			}, 3000);
		}

	/* Récupère la couleur d'un round à partir de ses coordonnées*/

	function getRoundColor(x, y, density)
	{
		return getPixelColor(x*density, y*density);
	}


	/* Récupère la couleur d'un pixel à partir de ses coordonnées */

	function getPixelColor (x, y)
	{
		var index = (x+(y*pixels.width))*4;
		return {
			r: pixels.data[index],
			g: pixels.data[index+1],
			b: pixels.data[index+2]
		};
	}



this.addEventListener('message', dispatcher, false);