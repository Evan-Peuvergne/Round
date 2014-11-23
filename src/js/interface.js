/*
	***********************
		Interface
	***********************
*/


	
	/* Changer de section */

	function goToSection (section)
	{
		switch(section)
		{
			case 1:
				interface_container.className = "first";
			break;
			case 2:
				interface_container.className = "second";
			break;
			case 3:
				interface_container.className = "third";
			break;
			case 4:
				interface_container.className = "fourth";
			break;
		}
	}


	/* Gestion des erreurs */

		
		/* Envoyer une erreur */

		function sendError (error)
		{
			// Show error
			image_error.innerHTML = error;
			image_error.className = "error active";

			// Return to form section
			goToSection(1);
		}


		/* Supprimer l'erreur */

		function removeError ()
		{
			image_error.className = "error";
		}