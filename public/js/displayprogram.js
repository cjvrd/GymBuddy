var cycles = JSON.parse(localStorage.getItem('userCycles'));

// Function to display cycleData in a specific days table
function displayDay(days, tableId) {
    const dayTableBody = document.getElementById(tableId);

    dayTableBody.innerHTML = ''; // Clear previous data

    days.exercises.forEach((exercises) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = exercises.name;

        const setsCell = document.createElement('td');
        setsCell.textContent = exercises.sets;

        const repsCell = document.createElement('td');
        repsCell.textContent = exercises.reps;

        const completeCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        completeCell.appendChild(checkbox);

        row.appendChild(nameCell);
        row.appendChild(setsCell);
        row.appendChild(repsCell);
        row.appendChild(completeCell);

        dayTableBody.appendChild(row);
    });
};

// Display the exercises for each day depending on the week
if (window.location.href.endsWith('/week1.html')) {
    displayDay(cycles[0].program.weeks[0].days[0], 'dayOneBody');
    displayDay(cycles[0].program.weeks[0].days[1], 'dayTwoBody');
    displayDay(cycles[0].program.weeks[0].days[2], 'dayThreeBody');
};

if (window.location.href.endsWith('/week2.html')) {
    displayDay(cycles[0].program.weeks[1].days[0], 'dayOneBody');
    displayDay(cycles[0].program.weeks[1].days[1], 'dayTwoBody');
    displayDay(cycles[0].program.weeks[1].days[2], 'dayThreeBody');
};

if (window.location.href.endsWith('/week3.html')) {
    displayDay(cycles[0].program.weeks[2].days[0], 'dayOneBody');
    displayDay(cycles[0].program.weeks[2].days[1], 'dayTwoBody');
    displayDay(cycles[0].program.weeks[2].days[2], 'dayThreeBody');
};

if (window.location.href.endsWith('/week4.html')) {
    displayDay(cycles[0].program.weeks[3].days[0], 'dayOneBody');
    displayDay(cycles[0].program.weeks[3].days[1], 'dayTwoBody');
    displayDay(cycles[0].program.weeks[3].days[2], 'dayThreeBody');
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

$(document).ready(function () {
    var cycles = JSON.parse(localStorage.getItem('userCycles'));
    var currentWeekDay = parseInt(localStorage.getItem('currentWeekDay'));
    var currentWeekNumber = parseInt(localStorage.getItem('currentWeekNumber'));
    console.log(cycles[0].program);

    // open current day
    toggleCollapse(currentWeekDay);
    setActiveWeek(currentWeekNumber);

});