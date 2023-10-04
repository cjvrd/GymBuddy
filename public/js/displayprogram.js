function displayDaysDetails(days) {
    days.map(day => {
        if (day.dayNumber === 1) {
            displayDay(day, 'dayOneBody');
        }
        if (day.dayNumber === 2) {
            displayDay(day, 'dayTwoBody');
        }
        if (day.dayNumber === 3) {
            displayDay(day, 'dayThreeBody');
        }
    })
};

// Function to display cycleData in a specific days table
function displayDay(day, tableId) {
    const dayTableBody = document.getElementById(tableId);

    dayTableBody.innerHTML = ''; // Clear previous data
    day.exercises.forEach((exercise) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = exercise.name;
        nameCell.classList.add('exercise-name')

        const setsCell = document.createElement('td');
        setsCell.textContent = exercise.sets;

        const repsCell = document.createElement('td');
        repsCell.textContent = exercise.reps;

        const completeCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('data-day-number', day.dayNumber)
        // check or uncheck the checkbox based on the 'done' value
        checkbox.checked = exercise.done;
        completeCell.appendChild(checkbox);

        row.appendChild(nameCell);
        row.appendChild(setsCell);
        row.appendChild(repsCell);
        row.appendChild(completeCell);

        dayTableBody.appendChild(row);
    });
};


function toggleCollapse(dayNumber) {
    var button1 = document.querySelector('#day1');
    var instance1 = new bootstrap.Collapse(button1, { toggle: false }); // ensure toggle is set to false
    var button2 = document.querySelector('#day2');
    var instance2 = new bootstrap.Collapse(button2, { toggle: false }); // ensure toggle is set to false
    var button3 = document.querySelector('#day3');
    var instance3 = new bootstrap.Collapse(button3, { toggle: false }); // ensure toggle is set to false

    if (dayNumber === 1) {
        instance1.show();
    }
    if (dayNumber === 2) {
        instance2.show();
    }
    if (dayNumber === 3) {
        instance3.show();
    }
};

function setActiveWeek(weekNumber) {
    // select all navigation links
    var navLinks = document.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
        if (i === weekNumber - 1) {
            navLinks[i].classList.add('active');
        } else {
            navLinks[i].classList.remove('active');
        }
    }
};

function getWeekExercises(cycle, weekNumber) {
    var week = cycle.find(week => week.weekNumber === weekNumber);
    var completeWeekCheckbox = document.getElementById('completeWeek');
    if (week.done) {
        completeWeekCheckbox.checked = true; //track if complete week checkbox is checked when week is done
    } else {
        completeWeekCheckbox.checked = false;
    }
    return week.days;
};

function updateCycleRequest() {
    // localStorage is always updated
    // here, we retrieve them before sending the update request to server
    var userId = JSON.parse(localStorage.getItem('userId'));
    var cycleId = JSON.parse(localStorage.getItem('cycleId'));
    var currentWeek = parseInt(localStorage.getItem('currentWeek'));
    var currentDay = parseInt(localStorage.getItem('currentDay'));
    var updatedProgram = JSON.parse(localStorage.getItem('program'));
    // the access token for auth
    const token = localStorage.getItem('token');

    fetch(`/update-program/${userId}/${cycleId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            program: updatedProgram,
            currentWeek: currentWeek,
            currentDay: currentDay
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data.message);
            }
        })
        .catch(err => {
            console.error('Error updating program:', err);
        });
};

function updateDisplay(isChecked, dayNumber, exerciseName, program, week, currentWeek, currentDay){
    
    // find day in which the user checks/unchecks exercise checkbox
    var day = week.days.find(d => d.dayNumber === dayNumber);
    if(day && day.exercises){
        // find the targeted exercise from 'program.week.day.exercises'
        var exercise = day.exercises.find(ex => ex.name === exerciseName);
        if(exercise){
            
            // give it the new value (checked/unchecked)
            exercise.done = isChecked;
            // Case 1: last exercise of the day
            var lastExercise = day.exercises[day.exercises.length - 1].name;
            if(exercise.name === lastExercise){
                day.done = isChecked;
                var lastDay = week.days.length;
                // Case 1.1: if user checks the box
                if(isChecked){
                    // Case 1.1.1: if last day of week
                    if(dayNumber === lastDay){
                        // Case 1.1.1.1: if last week
                        if(currentWeek === program.weeks.length){
                            program.done = true;
                        }
                        // Case 1.1.1.2: if not last week
                        else {
                            // currentWeek++;
                            // currentDay = 1;
                            console.log("checked last exercise!")
                        }
                        week.done = true;
                    }
                    // Case 1.1.2: if not last day of week
                    else {
                        currentDay++;
                    }
                }
                // Case 1.2: if user unchecks the box
                else {
                    // Case 1.2.1: if last day of week
                    if(dayNumber === lastDay){
                        // Case 1.2.1.1: if last week
                        if(currentWeek === program.weeks.length){
                            program.done = false;
                        }
                        // Case 1.2.1.2: if not last week
                        else {
                            currentWeek--;
                            currentDay = week.days.length;
                        }
                    }
                    // Case 1.2.2: if not last day of week
                    else {
                        currentDay--;
                    }
                }
            }
        } else {
            console.log("Something went wrong when finding the exercise")
        }

    }
    

    return {
        currentDay: currentDay,
        currentWeek: currentWeek,
        program: program
    };

}


$(document).ready(function () {
    // Note: all changes will be made on localStorage values, then 
    // separate functions will retrieve from localStorage and send fetch requests

    // retrieving 'program' from localStorage 
    // will be used to update 'done' of weeks, day, and exercises in localStorage 'program' 
    var program = JSON.parse(localStorage.getItem('program'));
    // helps track/update localStorage currentDay to help auto-toggle Day element
    var currentDay = parseInt(localStorage.getItem('currentDay'));
    // helps track/update localStorage currentWeek to help auto-activate Week tab
    var currentWeek = parseInt(localStorage.getItem('currentWeek'));
    // initially set to currentWeek, later changes as user switches between tabs
    var clickedWeek = currentWeek;

    // get the days of the on-going week and display each day's exercises
    var days = getWeekExercises(program.weeks, currentWeek);
    displayDaysDetails(days);

    // open current day and current week
    toggleCollapse(currentDay);
    setActiveWeek(currentWeek);


    // handle each exercise checkbox change 
    $(document).on('change', 'input[type="checkbox"]', function () {
        // is the exercise already checked?
        var isChecked = $(this).prop('checked');
        // which day number is the exercise in?
        var dayNumber = $(this).data('day-number');
        // name of exercise
        var exerciseName = $(this).closest('tr').find('.exercise-name').text();
        // to get the week.check value later
        var completeWeekCheckbox = document.getElementById('completeWeek');

        // number of weeks in the cycle
        var numWeeks = program.weeks.length;
        // reference 'program.week' related to clickedWeek
        var week = program.weeks.find(w => w.weekNumber === clickedWeek);

        // calling the function to update currentDay, currentWeek, and program when user checks exercise
        // ---------------------------------------------------------------------//
        var updatedValues = updateDisplay(isChecked, dayNumber, exerciseName, program, week, currentWeek, currentDay);

        currentDay = updatedValues.currentDay;
        currentWeek = updatedValues.currentWeek;
        program = updatedValues.program;
        
        localStorage.setItem('currentDay', currentDay.toString());
        localStorage.setItem('currentWeek', currentWeek.toString());
        localStorage.setItem('program', JSON.stringify(program));
        // ---------------------------------------------------------------------//

        // if complete week button is checked
        // --------------------------------------------------------------------//
        if ($(this).attr('id') === 'completeWeek') {
            let confirmText = 'Are you sure?\nThis cannot be undone.';
            if (confirm(confirmText) == true) { //confirm complete week first
                completeWeekCheckbox.setAttribute('disabled', true); //if week is done, disable checkbox
                week.done = isChecked;
                for (let day of week.days) { //if complete week is checked, check all exercises for that week
                    for (let exercise of day.exercises) {
                        exercise.done = isChecked;
                    };
                };
                if (week.done) {
                    if (currentWeek < numWeeks) { //if not last week, increment current week
                        currentDay = 1; //set current day back to 1
                        currentWeek++;
                    } else {
                        currentWeek = numWeeks; //if last week, stay on last week and complete program
                        program.done = isChecked;
                        currentDay = numDay;
                    };
                };
            } else {
                completeWeekCheckbox.checked = false;
            }

            localStorage.setItem('program', JSON.stringify(program));
            location.reload()
        }

        localStorage.setItem('currentDay', currentDay.toString()); //update current day in local storage
        localStorage.setItem('currentWeek', currentWeek.toString()); //update current week in local storage

        // update 'program' in localStorage 
        localStorage.setItem('program', JSON.stringify(program));

        // update the db
        updateCycleRequest(); 
    });


    // if week # clicked, update 'days' value
    // listener to week buttons should return clickedWeek number
    // add listener to week buttons
    $(document).on('click', '.nav-link', function () {
        $('.nav-link').removeClass('active');  // remove active class from all nav links
        $(this).addClass('active');  // add active class to the clicked nav link
        clickedWeek = $(this).data('week');
        // get the days of the clicked week and display each day's exercises
        var days = getWeekExercises(program.weeks, clickedWeek);
        displayDaysDetails(days);
    });

});



