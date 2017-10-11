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

			   	// Add values to table
			    $("tbody").append("<tr class='trainRecord'><td>" + 
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
});
