// Train Scheduler | By Juliette Rapala
// =====================================================================================

$(document).ready(function(){

	// Setup Variables 
	// =====================================================================================

		// Initialize Firebase
		var config = {
		    apiKey: "AIzaSyBxnnRtSx7b0R0FbBdGBk-F8Ygh9dqz--I",
		    authDomain: "train-scheduler-67666.firebaseapp.com",
		    databaseURL: "https://train-scheduler-67666.firebaseio.com",
		    projectId: "train-scheduler-67666",
		    storageBucket: "",
		    messagingSenderId: "357498440689"
		};

		firebase.initializeApp(config);
		var database = firebase.database();

		// Data varaiables
		var trainName = '';
		var destination = '';
		var firstTrainTime = '';
		var frequency = 0;
		var nextArrival = 0;
		var minutesAway = 0;

		// Get current time in moment.js format
		var currentTime = moment();

		// Train icon file
		var trainIcon = "<img src='assets/images/trainIcon.svg' height='20px'>"

		// RegEx for clock function
		var re = new RegExp("[0][0]$");

	// Main Processes 
	// =====================================================================================

		// Clock Function
		var updateClock = function() {
			var clockTime = moment().format('hh:mm:ss');
	  		$('#clock').html(clockTime);
	  		// If time ends in 00 seconds, reload page
	  		if (re.test(clockTime)) {
	    		location.reload();	
			}
		}

		// Update Welcome Message
		var $welcomeMessage = $('<h3>');
		$welcomeMessage.html("Welcome! The current time is <div id='clock' class='clock'></div>");
		$('#welcomeMessage').append($welcomeMessage);

		// Function that adds editing instructions when an Edit button is clicked.
		var editMessage = function() {
			var $editMessage = $('<h4 style="color:red">');
			$editMessage.html("Please change one field and press the Update button to submit changes.");
			$('#welcomeMessage').append($editMessage);
		}

		// Populate objects from database
		var updateTable = function() {
			database.ref().on("value", function(snapshot) {

				// Loop through values of each entry in the database and assign them to variables.
				snapshot.forEach(function(childSnapshot){
					trainName = childSnapshot.val().trainName;
				    destination = childSnapshot.val().destination;
				    frequency = childSnapshot.val().frequency;
				    firstTrainTime = childSnapshot.val().firstTrainTime;

				    // Time Calculations
					// =========================================

				    // Convert to firstTrainTime to moment.js format
				    var convertedFirstTrainTime = moment(firstTrainTime, 'HH:mm');

				    // Calculate next train arrival
				    for (var i = convertedFirstTrainTime; i.isBefore(currentTime); i.add(frequency, 'm')) {
				    	nextArrival = i;
				    }	

				   	// Calculate minutes until next train
				   	minutesAway = nextArrival.diff(currentTime, 'minutes');
				   	minutesAway++;


				   	// Create Table
					// =========================================

				   	// Get key of current object
				   	var currentKey = childSnapshot.key;

				   	// Value creation
				   	var trainNameShort = trainName.replace(/\s+/g, '').toLowerCase();

				   	// Create row
				   	var $trainRow = $('<tr>');
				   	$trainRow.attr('class', 'trainRecord');

				   	// Create cells
				   	var $trainNameCell = $('<td>');
					var $trainDestinationCell = $('<td>');
					var $trainFrequencyCell = $('<td>');
					var $trainNextArrivalCell = $('<td>');
					var $trainMinutesAwayCell = $('<td>');
					var $trainEditButtonCell = $('<td>');

					// Train name cell
				   	$trainNameCell.attr('value', trainNameShort);
				   	$trainNameCell.attr('class', 'name-' + trainNameShort);
				   	$trainNameCell.html(trainIcon + " " + trainName);
				   	$trainRow.append($trainNameCell);

				   	// Train destination cell
				   	$trainDestinationCell.attr('value', trainNameShort);
				   	$trainDestinationCell.attr('class', 'destination-' + trainNameShort);
				   	$trainDestinationCell.html(destination);
				   	$trainRow.append($trainDestinationCell);

				   	// Train frequency cell
				   	$trainFrequencyCell.attr('value', trainNameShort);
				   	$trainFrequencyCell.attr('class', 'frequency-' + trainNameShort); 	
				   	$trainFrequencyCell.html(frequency);
				   	$trainRow.append($trainFrequencyCell);

				   	// Train next arrival cell
				   	$trainNextArrivalCell.html(nextArrival.format("hh:mm A"));
				   	$trainRow.append($trainNextArrivalCell);
		   	
				   	// Train minutes away cell
				    $trainMinutesAwayCell.html(minutesAway);
				   	$trainRow.append($trainMinutesAwayCell);

				   	// Create Edit Button
				   	var $editButton = $('<button>');
				   	$editButton.attr('class', 'editButton');
				   	$editButton.attr('value', trainNameShort);
				   	$editButton.attr('data-key', currentKey);
				   	$editButton.html('Edit');

				   	// Train edit cell
				   	$trainEditButtonCell.html($editButton);
				   	$trainEditButtonCell.attr('class', 'buttonsCell');
				   	$trainRow.append($trainEditButtonCell);

				   	// Add row to table
		   			$("#trainsGoHere").append($trainRow);
				});

		  	// If any errors are experienced, log them to console.
			}, function(errorObject) {
		  		console.log("The read failed: " + errorObject.code);
			});

		// End of updateTable() function.
		};

		// Submit button click function
		$("#submitButton").on("click", function(event) {

			event.preventDefault();

			// Clear current table
			$('.trainRecord').empty();

			// Get values submitted via form
			trainName = $("#trainName").val().trim();
			destination = $("#destination").val().trim();
			firstTrainTime = $("#firstTrainTime").val();
			frequency = $("#frequency").val();

			// Add values to database
			database.ref().push({
				trainName: trainName,
				destination: destination,
				firstTrainTime: firstTrainTime,
				frequency : frequency
			});
		});

		// Edit button click function   
		$("#trainsGoHere").delegate(".editButton", "click", function() {

			event.preventDefault();

			// Hide all buttons except for the button in the current row that is being edited.
			$(".editButton").hide();
			$(this).show();

			// Change the Edit button to an Update button
			$(this).text('Update');
			$(this).attr('class', 'updateButton');

			// Add a Cancel button
			var $cancelButton = $('<button>');
			$cancelButton.attr('class', 'cancelButton');
			$cancelButton.html('Cancel');
			$(this).parent().append($cancelButton);

			// Display edit message
			editMessage();

			// Replace all cells in the row that was clicked with input fields.
			var rowClicked = $(this).val();

			var selectedNameCell = $('.name-'+rowClicked);
			selectedNameCell.empty();
			selectedNameCell.html('<input type="text" class="name-' + rowClicked + '-cell">');

			var selectedDestinationCell = $('.destination-'+rowClicked);
			selectedDestinationCell.empty();
			selectedDestinationCell.html('<input type="text" class="destination-' + rowClicked + '-cell">');

			var selectedFrequencyCell = $('.frequency-'+rowClicked);
			selectedFrequencyCell.empty();
			selectedFrequencyCell.html('<input type="text" class="frequency-' + rowClicked + '-cell">');
		});

		// Update button click function   
		$("#trainsGoHere").delegate(".updateButton", "click", function() {

			event.preventDefault();

			// Find out which row was updated.
			var rowClicked = $(this).val();

			var selectedNameCell = $('.name-'+rowClicked+'-cell');
			var selectedDestinationCell = $('.destination-'+rowClicked+'-cell');
			var selectedFrequencyCell = $('.frequency-'+rowClicked+'-cell');

			// Get values submitted via form
			trainName = selectedNameCell.val().trim();
			destination = selectedDestinationCell.val().trim();
			frequency = selectedFrequencyCell.val().trim();

			// Find out which key to update in the database
			var keyToUpdate = $(this).attr('data-key');

			// Update database entry if text entered is not blank
			if (trainName.length>0) {
				database.ref(keyToUpdate+"/trainName").set(trainName);
				location.reload();
			};
			if (destination.length>0) {
				database.ref(keyToUpdate+"/destination").set(destination);
				location.reload();
			};
			if (frequency.length>0) {
				database.ref(keyToUpdate+"/frequency").set(frequency);
				location.reload();
			};
		});

		// Cancel button click function 
		$("#trainsGoHere").delegate(".cancelButton", "click", function() {

			event.preventDefault();
			location.reload();

		});

	// Run App
	// =====================================================================================

	// Clock tick
	setInterval(updateClock, 1000);

	// Populate table
	updateTable();

// End of $(document).ready(function(){
});


// To Do
// =====================================================================================
// Add "Remove" buttons
// 
// * As a final challenge, make it so that only users who log into the site with their 
// Google or GitHub accounts can use your site. You'll need to read up on Firebase 
// authentication for this bonus exercise.
