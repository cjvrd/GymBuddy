// function to get first week after the last week that's labeled 'done=true' last
    // store week number
// function to get first day after the last day that's labeled 'done=true' last

$(document).ready(function () {
    
    // code for the tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // deactivate all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // activate clicked button and its corresponding pane
            button.classList.add('active');
            const targetPaneId = button.getAttribute('data-for');
            document.getElementById(targetPaneId).classList.add('active');
        });
    });

// handle logout
    $('#logoutButton').on('click', function (event) {
        event.preventDefault();
        logoutUser();
    });

    // calculating status in for dynamic values in tab1 content
    var cycles = JSON.parse(localStorage.getItem('userCycles'));
    var {completedDays, totalDays, CurrentWeekNumber, currentWeekDay} = calculateProgressByDays(cycles)
    // replacing html element with the number of completed days
    var daysCompletedElement = document.querySelector(".progress-details > p:nth-child(2)");
    daysCompletedElement.textContent = `${completedDays} out of 12 days completed`;
    // replacing week number in status
    var currentWeek = document.querySelector(".progress-details > p:nth-child(3)");
    currentWeek.textContent = `Week: ${CurrentWeekNumber}`;
    // replacing week number in status
    var currentWeek = document.querySelector(".progress-details > p:nth-child(4)");
    currentWeek.textContent = `Day: ${currentWeekDay}`;

    // code for the progress bar
    // say we want to show a 50% progress.
    let progressPercentage = 100*(completedDays/totalDays);

    // set the height of the progress-bar
    let progressBar = document.querySelector('.progress-bar');
    progressBar.style.height = progressPercentage + "%";

    // update text (assuming it's a simple percentage, adjust as needed)
    let progressText = document.querySelector('.progress-text');
    progressText.innerHTML = "&nbsp;"+progressPercentage + "%";

    // redirecting to week page
    // Select the .container element
    const container = document.querySelector('.container');

    // Add a click event listener to the .container element
    container.addEventListener('click', function() {
        // Redirect to the desired page
        window.location.href = 'week1.html';
    });
});

function calculateProgressByDays(cycles){
    let completedDays = 0;
    let totalDays = 0;
    let CurrentWeekNumber = 0;
    let currentWeekDay = 0;
    let currentDayExercise = 0;
    let dayFound = false;
    cycles[0].program.weeks.map(week =>{
        // console.log(week)
        if(week.done === true){
            CurrentWeekNumber++;
        }
        week.days.map(day => {
            if(day.done === true){
                completedDays++;
            }
            totalDays++;
        });
    });
    CurrentWeekNumber++;

    // find the current day of the week
    var currentWeekData = cycles[0].program.weeks.find(week => week.weekNumber === CurrentWeekNumber)
    currentWeekData.days.map(day => {
        if(day.done === true){
            currentWeekDay++;
        }
    })
    currentWeekDay++;

    // find the current exercise of the day
    var currentDayData = currentWeekData.days.find(day => day.dayNumber === currentWeekDay);
    currentDayData.exercises.map(exercise => {
        if(exercise.done === true){
            currentDayExercise++;
        }
    })
    currentDayExercise++;


    return ({completedDays, totalDays, CurrentWeekNumber, currentWeekDay, currentDayExercise});
}

