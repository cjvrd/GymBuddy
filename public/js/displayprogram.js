// var cycles = JSON.parse(localStorage.getItem('userCycles'));

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
        checkbox.checked = exercise.done
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
    if (week) {
        return week.days;
    } else {
        console.error('Week not found:', weekNumber);
        return [];
    }
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
}

function updateExerciseStatus(userId, weekNumber, dayNumber, exerciseName, status) {
    // Update status in localStorage
    let program = JSON.parse(localStorage.getItem('trainingProgram'));
    let exercise = program.weeks[weekNumber - 1].days[dayNumber - 1].exercises.find(ex => ex.name === exerciseName);
    if (exercise) {
        exercise.done = status;
        localStorage.setItem('trainingProgram', JSON.stringify(program));
    }

    // Update status in backend
    fetch('/update-exercise-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, weekNumber, dayNumber, exerciseName, status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== 'Exercise status updated successfully.') {
            console.error('Failed to update exercise status in backend:', data.error);
        }
    });
}
function updateDayStatus(userId, weekNumber, dayNumber, status) {
    // Update status in localStorage
    let program = JSON.parse(localStorage.getItem('trainingProgram'));
    let day = program.weeks[weekNumber - 1].days[dayNumber - 1];
    if (day) {
        day.done = status;
        localStorage.setItem('trainingProgram', JSON.stringify(program));
    }

    // Update status in backend
    fetch('/update-day-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, weekNumber, dayNumber, status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== 'Day status updated successfully.') {
            console.error('Failed to update day status in backend:', data.error);
        }
    });
}
function updateWeekStatus(userId, weekNumber, status) {
    // Update status in localStorage
    let program = JSON.parse(localStorage.getItem('trainingProgram'));
    let week = program.weeks[weekNumber - 1];
    if (week) {
        week.done = status;
        localStorage.setItem('trainingProgram', JSON.stringify(program));
    }

    // Update status in backend
    fetch('/update-week-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, weekNumber, status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== 'Week status updated successfully.') {
            console.error('Failed to update week status in backend:', data.error);
        }
    });
}

$(document).ready(function () {
    // var cycles = JSON.parse(localStorage.getItem('userCycles'));
    // program: {weeks:[], done: false}
    var program = JSON.parse(localStorage.getItem('program'));

    // console.log(program)
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
    $(document).on('change', 'input[type="checkbox"]', function() {
        var isChecked = $(this).prop('checked');
        var dayNumber = $(this).data('day-number');
        var exerciseName = $(this).closest('tr').find('.exercise-name').text();
        
        // find the week associated with the clickedWeek
        var week = program.weeks.find(w => w.weekNumber === clickedWeek);
        // number of weeks in the cycle
        var numWeeks = program.weeks.length;
        if(week){
            // find the number of workout days in this week
            var numDay = week.days.length;
            // find the day with dayNumber === dayNumber from checkbox
            var day = week.days.find(d => d.dayNumber === dayNumber);
            if(day){
                var exercise = day.exercises.find(ex => ex.name === exerciseName);
                if(exercise){
                    exercise.done = isChecked;  // Simply assign the 'isChecked' value to the 'done' property
                    // find name of last exercise to compare against checked exercise
                    var lastExercise = day.exercises[day.exercises.length-1].name;
                    if(exercise.name === lastExercise){
                        day.done = isChecked;
                        if(day.done){
                            currentDay++;
                            // if last day of week && day is completed/checked && last week: 
                            // check week & cycle, keep currentWeek and currentDay
                            if(day.dayNumber === numDay && week.weekNumber === numWeeks){
                                week.done = isChecked;
                                // cycle will be marked completed in backend
                                program.done = isChecked;
                            }
                            
                            // if last day of week && day is completed/checked: 
                            // check week and increment currentWeek
                            else if(day.dayNumber === numDay){
                                week.done = isChecked;
                                currentWeek++;
                                currentDay = 1;
                            }

                        } else {
                            currentDay--;
                            // if last day of week && day is unchecked: uncheck week
                            if(day.dayNumber === numDay){
                                week.done = isChecked;
                            }
                        }
                        localStorage.setItem('currentDay', currentDay.toString());
                        localStorage.setItem('currentWeek', currentWeek.toString());
                    }
                }
            }
        }
            
        if(isChecked) {
            console.log(`Checkbox for ${exerciseName} is checked!`);
        } else {
            console.log(`Checkbox for ${exerciseName} is unchecked!`);
        }
    
        // update 'program' in localStorage 
        localStorage.setItem('program', JSON.stringify(program));

        updateCycleRequest(program);
    });
    function updateExerciseStatus(userId, weekNumber, dayNumber, exerciseName, status) {
    // Update status in localStorage
    let program = JSON.parse(localStorage.getItem('trainingProgram'));
    let exercise = program.weeks[weekNumber - 1].days[dayNumber - 1].exercises.find(ex => ex.name === exerciseName);
    if (exercise) {
        exercise.done = status;
        localStorage.setItem('trainingProgram', JSON.stringify(program));
    }

    // Update status in backend
    fetch('/update-exercise-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, weekNumber, dayNumber, exerciseName, status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== 'Exercise status updated successfully.') {
            console.error('Failed to update exercise status in backend:', data.error);
        }
    });
}

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



