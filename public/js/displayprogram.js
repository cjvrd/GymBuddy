// var cycles = JSON.parse(localStorage.getItem('userCycles'));

// Function to display cycleData in a specific days table
function displayDay(day, tableId) {
    const dayTableBody = document.getElementById(tableId);

    dayTableBody.innerHTML = ''; // Clear previous data
    day.exercises.forEach((exercises) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = exercises.name;
        nameCell.classList.add('exercise-name')

        const setsCell = document.createElement('td');
        setsCell.textContent = exercises.sets;

        const repsCell = document.createElement('td');
        repsCell.textContent = exercises.reps;

        const completeCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('data-day-number', day.dayNumber)
        completeCell.appendChild(checkbox);

        row.appendChild(nameCell);
        row.appendChild(setsCell);
        row.appendChild(repsCell);
        row.appendChild(completeCell);

        dayTableBody.appendChild(row);
    });
};


function toggleCollapse(dayNumber){
    var button1 = document.querySelector('#day1');
    var instance1 = new bootstrap.Collapse(button1, { toggle: false }); // ensure toggle is set to false
    var button2 = document.querySelector('#day2');
    var instance2 = new bootstrap.Collapse(button2, { toggle: false }); // ensure toggle is set to false
    var button3 = document.querySelector('#day3');
    var instance3 = new bootstrap.Collapse(button3, { toggle: false }); // ensure toggle is set to false

    if(dayNumber === 1){
        instance1.show();
    } else if (dayNumber === 2){
        instance2.show();
    } else if (dayNumber === 3){
        instance3.show();
    }
}

function setActiveWeek(weekNumber) {
    // select all navigation links
    var navLinks = document.querySelectorAll('.nav-link');
    for (var i =0; i < navLinks.length; i++){
        if(i === weekNumber - 1){
            navLinks[i].classList.add('active');
        } else {
            navLinks[i].classList.remove('active');
        }
    }
}

function getWeekExercises(cycle, weekNumber){
    // var days = localStorage.get
    var week = cycle.find(week => week.weekNumber === weekNumber);
    return week.days;
}

function displayDaysDetails(days){
    days.map(day => {
        if (day.dayNumber === 1){
            displayDay(day, 'dayOneBody');
        } if (day.dayNumber === 2){
            displayDay(day, 'dayTwoBody');
        } if (day.dayNumber === 3){
            displayDay(day, 'dayThreeBody');
        }
    })
}

$(document).ready(function () {
    // var cycles = JSON.parse(localStorage.getItem('userCycles'));
    // program: {weeks:[], done: false}
    var program = JSON.parse(localStorage.getItem('program'));
    console.log(program)
    var currentWeekDay = parseInt(localStorage.getItem('currentWeekDay'));
    var currentWeekNumber = parseInt(localStorage.getItem('currentWeekNumber'));
    var clickedWeek = currentWeekNumber;
    // get the days of the on-going week and display each day's exercises
    var days = getWeekExercises(program.weeks, currentWeekNumber);
    displayDaysDetails(days);
    // open current day and current week
    toggleCollapse(currentWeekDay);
    setActiveWeek(currentWeekNumber);

    // handle checkbox changes
    $(document).on('change', 'input[type="checkbox"]', function() {
        var isChecked = $(this).prop('checked');
        var dayNumber = $(this).data('day-number');
        var exerciseName = $(this).closest('tr').find('.exercise-name').text();

        if(isChecked) {
            console.log(`Checkbox for ${exerciseName} is checked!`);
            // find the week associated with the clickedWeek
            var week = program.weeks.find(w => w.weekNumber === clickedWeek);
            if(week){
                // find the day with dayNumber === dayNumber from checkbox
                var day = week.days.find(d => d.dayNumber === dayNumber);
                if(day){
                    var exercise = day.exercises.find(ex => ex.name === exerciseName);
                    if(exercise){
                        exercise.done = true;
                    }
                }
            }
            // update 'program' in localStorage 
            localStorage.setItem('program', JSON.stringify(program));
        } else {
            console.log(`Checkbox for ${exerciseName} is unchecked!`);
        }
    })

    // if week # clicked, update 'days' value
    // listener to week buttons should return clickedWeek number
    // add listener to week buttons
    $(document).on('click', '.nav-link', function() {
        $('.nav-link').removeClass('active');  // remove active class from all nav links
        $(this).addClass('active');  // add active class to the clicked nav link
        clickedWeek = $(this).data('week');
        // get the days of the clicked week and display each day's exercises
        var days = getWeekExercises(program.weeks, clickedWeek);
        displayDaysDetails(days);
    });


});

