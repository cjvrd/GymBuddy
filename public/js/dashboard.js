$(document).ready(function () {
	// calculating status in for dynamic values in tab1 content
	var program = JSON.parse(localStorage.getItem('program'));
	var currentWeek = parseInt(localStorage.getItem('currentWeek'));
	var currentDay = parseInt(localStorage.getItem('currentDay'));
	
	//training button
	$('#trainingButton').on('click', function () {
		window.location.href = '/training.html';
	});
	
	// chatroom button
	$('#chatroomButton').on('click', function () {
		window.location.href = '/chatroom.html';
	});

	if (!program.done) {
		document.getElementById('resetCycleButton').style.display = "none";
	} else {
		document.getElementById('trainingButton').style.display = "none";

	}

	// reset cycle button
	$('#resetCycleButton').on('click', function () {
		let confirmText = 'Are you sure?\nThis cannot be undone.';
		if (confirm(confirmText) == true) {
			resetCycle(program);
		};
		window.location.href = '/training.html';
	});


	var { totalDays } = calculateTotalDays(program);
	var { completedDays } = calculateCompletedDays(program);
	// replacing html element with the number of completed days
	var daysCompletedElement = document.querySelector(".progress-details > p:nth-child(1)");
	daysCompletedElement.textContent = `${completedDays} out of 12 days completed`;
	// replacing week number in status
	var weekElement = document.querySelector(".progress-details > p:nth-child(2)");
	weekElement.textContent = `Week: ${currentWeek}`;
	// replacing day number in status
	var dayElement = document.querySelector(".progress-details > p:nth-child(3)");
	dayElement.textContent = `Day: ${currentDay}`;

	// code for the progress bar
	let progressPercentage = 100 * (completedDays / totalDays);

	// set the height of the progress-bar
	let progressBar = document.querySelector('.progress-bar');
	progressBar.style.height = progressPercentage + "%";

	// update text (assuming it's a simple percentage, adjust as needed)
	let progressText = document.querySelector('.progress-text');
	progressText.innerHTML = "&nbsp;" + progressPercentage.toFixed(2) + " %";
});

function resetCycle(program) {
	var program = JSON.parse(localStorage.getItem('program'));
	var currentWeek = parseInt(localStorage.getItem('currentWeek'));
	var currentDay = parseInt(localStorage.getItem('currentDay'));
	program.done = false;
	currentDay = 1;
	currentWeek = 1;
	for (const week of program.weeks) {
		week.done = false;
		for (const day of week.days) {
			day.done = false;
			for (const exercise of day.exercises) {
				exercise.done = false;
			};
		};
	};
	localStorage.setItem('program', JSON.stringify(program));
	localStorage.setItem('currentDay', currentDay.toString()); //update current day in local storage
	localStorage.setItem('currentWeek', currentWeek.toString()); //update current week in local storage
};

function calculateTotalDays(program) {
	let totalDays = 0;
	// calculating total days of workout
	program.weeks.map(week => {
		totalDays += week.days.length;
	});
	return ({ totalDays });
}

function calculateCompletedDays(program) {

	let completedDays = 0;

	// Iterate over the weeks
	for (const week of program.weeks) {
		if (week.done) {
			// If the entire week is marked as done, increment the completed days count by the number of days in that week
			completedDays += week.days.length;
		} else {
			// If the week is not marked as done, check individual days
			for (const day of week.days) {
				if (day.done) {
					// If the day is marked as done, increment the completed days count by 1
					completedDays++;
				}
			}
		}
	}

	return { completedDays };
};


