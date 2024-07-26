document.addEventListener('DOMContentLoaded', () => {
    const activityForm = document.getElementById('activityForm');
    const goalForm = document.getElementById('goalForm');
    const activityHistory = document.getElementById('activityHistory');
    const summaryStatistics = document.getElementById('summaryStatistics');
    const progressTracking = document.getElementById('progressTracking');
    const totalDurationElem = document.getElementById('totalDuration');
    const totalDistanceElem = document.getElementById('totalDistance');
    const totalCaloriesElem = document.getElementById('totalCalories');
    const goalProgressElem = document.getElementById('goalProgress');
    const progressBar = document.getElementById('progressBar');

    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    let goal = JSON.parse(localStorage.getItem('goal')) || null;

    function updateActivityHistory() {
        activityHistory.innerHTML = '';
        activities.forEach(activity => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                <strong>Type:</strong> ${activity.type} <br>
                <strong>Duration:</strong> ${activity.duration} mins <br>
                <strong>Distance:</strong> ${activity.distance} km <br>
                <strong>Calories:</strong> ${activity.calories} cal
            `;
            activityHistory.appendChild(li);
        });
        updateSummaryStatistics();
        updateProgressTracking();
    }

    function updateSummaryStatistics() {
        const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
        const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
        const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0);

        totalDurationElem.textContent = `Total Duration: ${totalDuration} minutes`;
        totalDistanceElem.textContent = `Total Distance: ${totalDistance.toFixed(2)} km`;
        totalCaloriesElem.textContent = `Total Calories: ${totalCalories} cal`;
    }

    function updateProgressTracking() {
        if (goal) {
            const total = activities.reduce((sum, activity) => {
                switch (goal.type) {
                    case 'duration': return sum + activity.duration;
                    case 'distance': return sum + activity.distance;
                    case 'calories': return sum + activity.calories;
                    default: return sum;
                }
            }, 0);

            const percentage = Math.min(100, (total / goal.value) * 100);
            goalProgressElem.textContent = `Goal Progress: ${percentage.toFixed(2)}%`;
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
            progressBar.textContent = `${percentage.toFixed(2)}%`;
        } else {
            goalProgressElem.textContent = 'No goal set.';
            progressBar.style.width = '0%';
            progressBar.setAttribute('aria-valuenow', 0);
            progressBar.textContent = '0%';
        }
    }

    activityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const activity = {
            type: document.getElementById('activityType').value,
            duration: parseInt(document.getElementById('duration').value),
            distance: parseFloat(document.getElementById('distance').value) || 0,
            calories: parseInt(document.getElementById('calories').value) || 0
        };
        activities.push(activity);
        localStorage.setItem('activities', JSON.stringify(activities));
        updateActivityHistory();
        activityForm.reset(); 
    });

    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        goal = {
            type: document.getElementById('goalType').value,
            value: parseFloat(document.getElementById('goalValue').value)
        };
        localStorage.setItem('goal', JSON.stringify(goal));
        updateProgressTracking();
        goalForm.reset(); 
    });

    updateActivityHistory();
});
