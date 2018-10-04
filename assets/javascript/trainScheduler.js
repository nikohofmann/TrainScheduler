// Initialize Firebase
var config = {
  apiKey: "AIzaSyD6-8U4QD6jeAArFxb1tEoiIvxLH-uvSO8",
  authDomain: "niko-test-project-2bcbc.firebaseapp.com",
  databaseURL: "https://niko-test-project-2bcbc.firebaseio.com",
  projectId: "niko-test-project-2bcbc",
  storageBucket: "niko-test-project-2bcbc.appspot.com",
  messagingSenderId: "584420458438"
};
firebase.initializeApp(config);

var database = firebase.database();

$("button#clearBtn").on("click", function(event) {
  event.preventDefault();
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#first-time-input").val("");
  $("#frequency-input").val("");
});

$("button#addTrainBtn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#name-input").val();
  var trainDestination = $("#destination-input").val();
  var trainTime = moment().subtract(2, "days").format("YYYY-MM-DD") + " " + $("#first-time-input").val();
  var trainFrequency = $("#frequency-input").val();

  if (trainName !== "" && trainDestination !== "" && trainTime !== "" && trainFrequency !== "") {
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      time: trainTime,
      freqency: trainFrequency
    };

    database.ref("/trains").push(newTrain);

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");
  }
});

database.ref("/trains").on("child_added", function(snapshot) {
  var firstTime = snapshot.val().time;
  var firstTimeConverted = moment(firstTime, "MM-DD-YYYY HH:mm").format("HH:mm");
  var currentTime = moment();
  var diffTime = moment().diff(moment(firstTime), "minutes");

  var trainName = snapshot.val().name;
  var trainDestination = snapshot.val().destination;
  var trainFrequency = snapshot.val().freqency;
  var trainMinutesAway = trainFrequency - (diffTime % trainFrequency);
  var trainNextTime = moment().add(trainMinutesAway, "minutes").format("HH:mm");

  var newRow = $("<tr>");
  newRow.append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(trainNextTime),
    $("<td>").text(trainMinutesAway + " min")
  );
  $("#train-table").append(newRow);
});