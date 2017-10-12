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
		function update() {
			var clockTime = moment().format('hh:mm:ss');
	  		$('#clock').html(clockTime);
	  		// If time ends in 00 seconds, reload page
	  		if (re.test(clockTime)) {
	    		location.reload();	
			}
		}
		setInterval(update, 1000);

		// Update Welcome Message
		var $welcomeMessage = $('<h3>');
		$welcomeMessage.html("Welcome! The current time is <div id='clock' class='clock'></div>");
		$('#welcomeMessage').append($welcomeMessage);

		// Function that adds editing instructions when an Edit button is clicked.
		var editMessage = function () {
			var $editMessage = $('<h4 style="color:red">');
			$editMessage.html("Please change one field and press the Edit button, otherwise refresh page to exit.");
			$('#welcomeMessage').append($editMessage);
		}

		// Populate objects from database
		database.ref().on("value", function(snapshot) {

			// Loop through values of each entry in the database and assign them to variables.
			snapshot.forEach(function(childSnapshot){
				trainName = childSnapshot.val().trainName;
			    destination = childSnapshot.val().destination;
			    frequency = childSnapshot.val().frequency;
			    firstTrainTime = childSnapshot.val().firstTrainTime;

			    // Convert to firstTrainTime to moment.js format
			    var convertedFirstTrainTime = moment(firstTrainTime, 'HH:mm');

			    // Calculate next train arrival
			    for (var i = convertedFirstTrainTime; i.isBefore(currentTime); i.add(frequency, 'm')) {
			    	nextArrival = i;
			    }	

			   	// Calculate minutes until next train
			   	minutesAway = nextArrival.diff(currentTime, 'minutes');
			   	minutesAway++;

			   	// Get key of current object
			   	var currentKey = childSnapshot.key;

			   	// Create Edit Button
			   	var trainNameShort = trainName.replace(/\s+/g, '').toLowerCase();
			   	var trainValue = " value='" + trainNameShort + "'";
			   	var editButton = "<button class='editButton'" + trainValue + " data-key='" + currentKey + "'>Edit</button>";

			   	// Add values to table
			    $("#trainsGoHere").append("<tr class='trainRecord'><td class='" + trainNameShort + "' data-key='" + currentKey + "' value='" + trainName + "'>" + 
			    	trainIcon + " " + 
			    	trainName + 
			    	"</td><td>" + 
			    	destination + 
			    	"</td><td>" + 
			    	frequency + 
			    	"</td><td>" + 
			    	nextArrival.format("hh:mm A") + 
			    	"</td><td>" + 
			    	minutesAway + 
			    	"</td><td>" +
			    	editButton +
			    	"</td></tr>");
			});


	  	// If any errors are experienced, log them to console.
		}, function(errorObject) {
	  		console.log("The read failed: " + errorObject.code);
		});

		// Submit to database
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

		// Update 

		$("#trainsGoHere").delegate(".editButton", "click", function() {

			event.preventDefault();

			// Hide all buttons except for the current row that is being edited.
			$(".editButton").hide();
			$(this).show();

			// Change button to an Update button
			$(this).text('Update');
			$(this).attr('class', 'updateButton');

			// Display edit message
			editMessage();

			// Replace all cells in the row that was clicked with input fields.
			var rowClicked = $(this).val();
			var selectedCells = $('.'+rowClicked);
			selectedCells.empty();
			selectedCells.append('<input type="text" id="redlinetrainname">');
			
			var newTrainName = selectedCells.val()

		});

		$("#trainsGoHere").delegate(".updateButton", "click", function() {

			event.preventDefault();

			// Get values submitted via form
			trainName = $("#redlinetrainname").val().trim();
			var keyToUpdate = $(this).attr('data-key');
			// Update database entry if text entered is not blank
			if (trainName.length>0) {
				database.ref(keyToUpdate+"/trainName").set(trainName);
				location.reload();
			};

			// Add values to database
			// database.ref().set({
			// 	trainName: trainName,
			// });


		});


});

//database.ref("key/trainName").set(trainName);
// Add update button to each row
// 
// Add remove button to each row

// To Do
// =====================================================================================
// * Try adding `update` and `remove` buttons for each train. Let the user edit the row's 
// elements-- allow them to change a train's Name, Destination and Arrival Time (and then, 
// by relation, minutes to arrival).
// 
// * As a final challenge, make it so that only users who log into the site with their 
// Google or GitHub accounts can use your site. You'll need to read up on Firebase 
// authentication for this bonus exercise.
