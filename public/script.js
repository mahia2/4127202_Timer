let timerInterval;

document.getElementById('setTimes').addEventListener('click', function() {
    let startTime = new Date(document.getElementById('startTime').value);
    let endTime = new Date(document.getElementById('endTime').value);
    let restrictedStart = parseInt(document.getElementById('restrictedStart').value) * 60 * 1000;
    let restrictedEnd = parseInt(document.getElementById('restrictedEnd').value) * 60 * 1000;

    if (startTime >= endTime) {
        alert('End time must be after start time.');
        return;
    }

    startCountdown(startTime, endTime, restrictedStart, restrictedEnd);
});

function startCountdown(startTime, endTime, restrictedStart, restrictedEnd) {
    clearInterval(timerInterval);

    let currentTime = new Date();
    let timeDifference = startTime - currentTime;

    if (timeDifference <= 0) {
        // If start time is already past, start the timer immediately
        startTimer(endTime, startTime, restrictedStart, restrictedEnd);
    } else {
        // Wait until start time to begin the timer
        setTimeout(function() {
            startTimer(endTime, startTime, restrictedStart, restrictedEnd);
        }, timeDifference);
    }
}

function startTimer(endTime, startTime, restrictedStart, restrictedEnd) {
    timerInterval = setInterval(function() {
        let currentTime = new Date();
        let timeDifference = endTime - currentTime;

        if (timeDifference <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timer').textContent = '00:00:00';
            displayAlert("Exam time is over. Please submit your answers.");
            return;
        }

        let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.getElementById('timer').textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        
        // alert messages based on time
        let timeElapsed = currentTime - startTime;
        let firstRestrictedPeriod = restrictedStart;
        let lastRestrictedPeriod = endTime - restrictedEnd;

        if (timeElapsed < firstRestrictedPeriod || currentTime > lastRestrictedPeriod) {
            displayAlert("You are not allowed to leave the room", 'error');
        } else {
            displayAlert("You can leave the room if necessary", 'info');
        }

    }, 1000);
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

function displayAlert(message, type = 'info') {
    let alertBox = document.getElementById('alertMessage');
    alertBox.textContent = message;
    alertBox.style.color = type === 'error' ? 'red' : 'green';
}

document.getElementById('invigilatorForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let moduleName = document.getElementById('moduleName').value;
    let studentsAttended = document.getElementById('studentsAttended').value;
    let logIssues = document.getElementById('logIssues').value;

    let data = {
        moduleName: moduleName,
        studentsAttended: studentsAttended,
        logIssues: logIssues
    };

    fetch('/save-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);
        document.getElementById('responseMessage').textContent = 'Information saved successfully!';
        document.getElementById('invigilatorForm').reset(); // Clear form fields
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('responseMessage').textContent = 'An error occurred while saving the information.';
    });
});