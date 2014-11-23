<?php

	header("Content-type: application/json");

	if($_POST){
		// Récupération de l'URL
		$url = $_POST['url'];
		 
		// On créer un nom de fichier
		$name = basename($url);
		list($txt, $ext) = explode(".", $name);
		$ext = strtolower($ext);
		$name = $txt.time();
		$name = $name.".".$ext;
		 
		// On teste la validité de l'image
		if($ext == "jpg" or $ext == "png" or $ext == "gif"){
			//here is the actual code to get the file from the url and save it to the uploads folder
			//get the file from the url using file_get_contents and put it into the folder using file_put_contents
			$upload = file_put_contents("uploads/$name",file_get_contents($url));
			//check success
			if($upload){
				echo json_encode(array(
					"success" => true,
					"image" => "uploads/".$name
				));
			}else{
				echo json_encode(array(
					"success" => false,
					"message" => "L'upload n'a pas fonctionné."
				));
			}
		}else{
			echo json_encode(array(
				"success" => false,
				"message" => "Vous ne pouvez uploader que des images"
			));
		}
	}

?>