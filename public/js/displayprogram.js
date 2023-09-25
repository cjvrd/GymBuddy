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
}

// Display the exercises for each day depending on the week
if (window.location.href.endsWith('/week1.html')) {
    displayDay(cycles[0].program.weeks[0].days[0], 'dayOneBody');
    displayDay(cycles[0].program.weeks[0].days[1], 'dayTwoBody');
    displayDay(cycles[0].program.weeks[0].days[2], 'dayThreeBody');
}

if (window.location.href.endsWith('/week2.html')) {
    displayDay(cycles[0].program.weeks[1].days[0], 'dayOneBody');
    displayDay(cycles[0].program.weeks[1].days[1], 'dayTwoBody');
    displayDay(cycles[0].program.weeks[1].days[2], 'dayThreeBody');
}

if (window.location.href.endsWith('/week3.html')) {
    displayDay(cycles[0].program.weeks[2].days[0], 'dayOneBody');
    displayDay(cycles[0].program.weeks[2].days[1], 'dayTwoBody');
    displayDay(cycles[0].program.weeks[2].days[2], 'dayThreeBody');
}

if (window.location.href.endsWith('/week4.html')) {
    displayDay(cycles[0].program.weeks[3].days[0], 'dayOneBody');
    displayDay(cycles[0].program.weeks[3].days[1], 'dayTwoBody');
    displayDay(cycles[0].program.weeks[3].days[2], 'dayThreeBody');
}