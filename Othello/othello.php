<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Othello</title>
		<script src="modernizr-1.5.js"></script>
		<link href="othello_reset.css" rel="stylesheet" />
		<link href="othelloStyle.css" type="text/css" rel="stylesheet"/>
		<script src="jquery.js" type="text/javascript"></script>
		<script src="gridBuilder.js" type="text/javascript"></script>
	</head>
	
	<body>		
		
		<div id = "gameBoard">
		
			<header>
				<hgroup>
					<h1>Othello</h1>
						<h2>A minute to learn, a lifetime to master.</h2>
				</hgroup>
			</header> 
	
			<?php require 'othello_game.php';
				echo "File is found.";
			?>
	
			<figure id="othelloGame">
			</figure>
				
		<button type = "button" id ="newGame">
			New Game!
		</button>
			
		<button type = "button" id ="skipTurn">
		</button>
		
		<figure id="scoreBoard">
		</figure>
			
		</div>

		
	</body>
	
</html>