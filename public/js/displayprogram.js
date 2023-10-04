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

function updateCycleRequest(updatedProgram) {
    var userId = JSON.parse(localStorage.getItem('userId'));
    var cycleId = JSON.parse(localStorage.getItem('cycleId'));
    var currentWeek = parseInt(localStorage.getItem('currentWeek'));
    var currentDay = parseInt(localStorage.getItem('currentDay'));
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


$(document).ready(function () {
    var program = JSON.parse(localStorage.getItem('program'));
    var currentDay = parseInt(localStorage.getItem('currentDay'));
    var currentWeek = parseInt(localStorage.getItem('currentWeek'));
    var clickedWeek = currentWeek;

    // get the days of the on-going week and display each day's exercises
    var days = getWeekExercises(program.weeks, currentWeek);
    displayDaysDetails(days);

    // open current day and current week
    toggleCollapse(currentDay);
    setActiveWeek(currentWeek);


    // handle checkbox changes
    $(document).on('change', 'input[type="checkbox"]', function () {
        var isChecked = $(this).prop('checked');
        var dayNumber = $(this).data('day-number');
        var exerciseName = $(this).closest('tr').find('.exercise-name').text();

        var completeWeekCheckbox = document.getElementById('completeWeek');

        // find the week associated with the clickedWeek
        var week = program.weeks.find(w => w.weekNumber === clickedWeek);
        // number of weeks in the cycle
        var numWeeks = program.weeks.length;
        if (week) {
            // find the number of workout days in this week
            var numDay = week.days.length;
            // find the day with dayNumber === dayNumber from checkbox
            var day = week.days.find(d => d.dayNumber === dayNumber);
            if (day) {
                var exercise = day.exercises.find(ex => ex.name === exerciseName);
                if (exercise) {
                    exercise.done = isChecked;  // Simply assign the 'isChecked' value to the 'done' property
                    // find name of last exercise to compare against checked exercise
                    var lastExercise = day.exercises[day.exercises.length - 1].name;
                    if (exercise.name === lastExercise) {
                        day.done = isChecked; //if it is last exercise, day = done
                        if (day.done) {
                            if (currentDay < numDay) { //not last day, increment current day
                                currentDay++;
                            };
                        } else { //if day is unchcked and not first day, decrement currentday
                            if (currentDay > 1)
                            currentDay--;
                        };
                    };
                };
            };
        };
        //if complete week checkbox is checked, week = done
        if (completeWeekCheckbox.checked) {
            let confirmText = 'Are you sure?\nThis cannot be undone.';
            if (confirm(confirmText) == true) { //confirm complete week first
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
                    };
                };
            } else {
                completeWeekCheckbox.checked = false;
            }
        };

        if (week.done = true) {
            completeWeekCheckbox.setAttribute('disabled', true);
        };

        localStorage.setItem('currentDay', currentDay.toString()); //update current day in local storage
        localStorage.setItem('currentWeek', currentWeek.toString()); //update current week in local storage

        if (isChecked) { //add check message for complete week
            console.log(`Checkbox for ${exerciseName} is checked!`);
        } else {
            console.log(`Checkbox for ${exerciseName} is unchecked!`);
        };

        // update 'program' in localStorage 
        localStorage.setItem('program', JSON.stringify(program));

        updateCycleRequest(program); //post local storage chagnes to DB
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



