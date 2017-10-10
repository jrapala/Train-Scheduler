// Train Scheduler | By Juliette Rapala
// =====================================================================================



$(document).ready(function(){

	// $.getScript("https://www.gstatic.com/firebasejs/4.5.0/firebase.js", function() {
	// 	console.log("Script loaded but not necessarily executed.");
	// });

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

	var trainName = '';
	var destination = '';
	var firstTrainTime = '';
	var frequency = 0;
	var nextArrival = 0;
	var minutesAway = 0;


	// Main Processes 
	// =====================================================================================


	// Populate objects from database
	database.ref().on("value", function(snapshot) {

		snapshot.forEach(function(childSnapshot){
			trainName = childSnapshot.val().trainName;
		    destination = childSnapshot.val().destination;
		    frequency = childSnapshot.val().frequency;
		    nextArrival = childSnapshot.val().nextArrival;
			minutesAway = childSnapshot.val().minutesAway;

		      //var convertedDate = moment(startDate, "DD/MM/YY");
		      //var monthsActuallyWorked = moment(convertedDate, '')

		    $("tbody").append("<tr class='trainRecord'><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
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
		  frequency: frequency,
		  nextArrival : nextArrival,
		  minutesAway : minutesAway
		});
	});
});
