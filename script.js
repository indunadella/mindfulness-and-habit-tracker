// State Management
const state = {
    habits: JSON.parse(localStorage.getItem('habits')) || [],
    thoughts: JSON.parse(localStorage.getItem('thoughts')) || [],
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    health: JSON.parse(localStorage.getItem('health')) || {
        sleep: [],
        mood: []
    }
};

// Save state to localStorage
const saveState = () => {
    localStorage.setItem('habits', JSON.stringify(state.habits));
    localStorage.setItem('thoughts', JSON.stringify(state.thoughts));
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('health', JSON.stringify(state.health));
};

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.dataset.section;
        if (section) {
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}-section`).classList.add('active');
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('body-dark');
    document.body.classList.toggle('body-light');

    if (document.body.classList.contains('body-dark')) {
        icon.classList.remove('bi-sun');
        icon.classList.add('bi-moon');
    } else {
        icon.classList.remove('bi-moon');
        icon.classList.add('bi-sun');
    }
});

// Navigation for Section Links
document.querySelectorAll('.section-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.dataset.section;
        if (section) {
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}-section`).classList.add('active');
        }
    });
});
// Habits Management
const habitForm = document.getElementById('habit-form');
const habitsListElement = document.getElementById('habits-list');

const renderHabits = () => {
    habitsListElement.innerHTML = state.habits.map((habit, index) => `
        <tr data-id="${index}">
            <td>${habit.name}</td>
            <td>${habit.time}</td>
            ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `
                <td>
                    <input type="checkbox" 
                           ${habit.days?.includes(day) ? 'checked' : ''} 
                           data-day="${day}"
                           class="habit-checkbox">
                </td>
            `).join('')}
            <td>
                <button class="btn btn-danger btn-sm delete-habit">Delete</button>
            </td>
        </tr>
    `).join('');

    // Add event listeners for checkboxes
    document.querySelectorAll('.habit-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const habitIndex = e.target.closest('tr').dataset.id;
            const day = e.target.dataset.day;
            
            if (!state.habits[habitIndex].days) {
                state.habits[habitIndex].days = [];
            }

            if (e.target.checked) {
                state.habits[habitIndex].days.push(day);
            } else {
                state.habits[habitIndex].days = state.habits[habitIndex].days.filter(d => d !== day);
            }
            
            saveState();
        });
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-habit').forEach(button => {
        button.addEventListener('click', (e) => {
            const habitIndex = e.target.closest('tr').dataset.id;
            state.habits.splice(habitIndex, 1);  // Remove habit from the state
            saveState();  // Save updated state to localStorage
            renderHabits();  // Re-render the updated habits list
        });
    });
};

// Form submission event to add new habit
habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const habitName = document.getElementById('habit-name').value.trim();
    const habitTime = document.getElementById('habit-time').value;

    if (habitName && habitTime) {
        state.habits.push({ name: habitName, time: habitTime, days: [] });
        saveState();  // Save updated state to localStorage
        renderHabits();  // Re-render the habits list

        // Clear form inputs
        habitForm.reset();
    }
});

// Breathing Exercise
const startBreathingBtn = document.getElementById('start-breathing');
const breathingCircle = document.querySelector('.breathing-circle');
const breathingText = document.querySelector('.breathing-text');

let breathingInterval;

startBreathingBtn.addEventListener('click', () => {
    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
        startBreathingBtn.textContent = 'Start Breathing Exercise';
        breathingCircle.className = 'breathing-circle';
        breathingText.textContent = 'Ready';
    } else {
        startBreathingBtn.textContent = 'Stop Breathing Exercise';
        breathingInterval = setInterval(breathingCycle, 12000);
        breathingCycle();
    }
});

function breathingCycle() {
    // Inhale
    breathingCircle.className = 'breathing-circle inhale';
    breathingText.textContent = 'Inhale';
    
    setTimeout(() => {
        // Hold
        breathingCircle.className = 'breathing-circle hold';
        breathingText.textContent = 'Hold';
        
        setTimeout(() => {
            // Exhale
            breathingCircle.className = 'breathing-circle exhale';
            breathingText.textContent = 'Exhale';
        }, 4000);
    }, 4000);
}
// Thoughts Management
const thoughtForm = document.getElementById('thought-form');
const thoughtsListElement = document.getElementById('thoughts-list');

const renderThoughts = () => {
    if (state.thoughts.length === 0) {
        thoughtsListElement.innerHTML = '<p class="text-muted">No thoughts shared yet.</p>';
        return;
    }

    thoughtsListElement.innerHTML = state.thoughts.map((thought, index) => `
        <div class="card mb-3 thought-card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <p class="card-text mb-2">${thought.content}</p>
                        <small class="text-muted">${new Date(thought.timestamp).toLocaleString()}</small>
                    </div>
                    <button class="btn btn-danger btn-sm delete-thought" data-id="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-thought').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-id'));
            state.thoughts.splice(index, 1);
            saveState();
            renderThoughts();
        });
    });
};

thoughtForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const thoughtInput = document.getElementById('thought-input');
    const thoughtContent = thoughtInput.value.trim();

    if (thoughtContent) {
        // Add new thought at the beginning of the array
        state.thoughts.unshift({
            content: thoughtContent,
            timestamp: Date.now()
        });
        
        // Save to localStorage
        saveState();
        
        // Clear the input
        thoughtInput.value = '';
        
        // Re-render the thoughts list
        renderThoughts();
    }
});

// Initial render of thoughts when page loads
document.addEventListener('DOMContentLoaded', () => {
    renderThoughts();
});
// Tasks Management
const taskForm = document.getElementById('task-form');
const tasksListElement = document.getElementById('tasks-list');

const renderTasks = () => {
    tasksListElement.innerHTML = state.tasks.map((task, index) => `
        <div class="list-group-item d-flex justify-content-between align-items-center">
            <span>${task}</span>
            <button class="btn btn-danger btn-sm delete-task" data-id="${index}">Delete</button>
        </div>
    `).join('');

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-task').forEach(button => {
        button.addEventListener('click', (e) => {
            const taskIndex = e.target.dataset.id;
            state.tasks.splice(taskIndex, 1);
            saveState();
            renderTasks();
        });
    });
};

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskInput = document.getElementById('task-input');
    const taskContent = taskInput.value.trim();

    if (taskContent) {
        state.tasks.push(taskContent);
        saveState();
        renderTasks();
        taskInput.value = '';
    }
});

// Health Management
const sleepForm = document.getElementById('sleep-form');
const moodForm = document.getElementById('mood-form');
const healthStatusElement = document.getElementById('health-status');

// Sleep Analysis and Recommendations
const analyzeSleep = (sleepTime, wakeTime) => {
    // Convert time strings to Date objects for calculation
    const sleep = new Date(`2000/01/01 ${sleepTime}`);
    const wake = new Date(`2000/01/01 ${wakeTime}`);
    
    // If wake time is earlier than sleep time, add 1 day to wake time
    if (wake < sleep) {
        wake.setDate(wake.getDate() + 1);
    }
    
    // Calculate sleep duration in hours
    const sleepDuration = (wake - sleep) / (1000 * 60 * 60);
    
    let status = '';
    let recommendation = '';

    if (sleepDuration < 6) {
        status = 'Warning: Insufficient Sleep';
        recommendation = `
            <div class="alert alert-danger">
                <strong>You only slept for ${sleepDuration.toFixed(1)} hours!</strong>
                <ul>
                    <li>Lack of sleep can impair cognitive function and immune system</li>
                    <li>Try to go to bed earlier tonight</li>
                    <li>Avoid screens 1 hour before bedtime</li>
                    <li>Consider taking a short nap during the day</li>
                </ul>
            </div>
        `;
    } else if (sleepDuration > 10) {
        status = 'Warning: Excessive Sleep';
        recommendation = `
            <div class="alert alert-warning">
                <strong>You slept for ${sleepDuration.toFixed(1)} hours!</strong>
                <ul>
                    <li>Oversleeping can lead to lethargy and reduced productivity</li>
                    <li>Try to maintain a consistent sleep schedule</li>
                    <li>Increase physical activity during the day</li>
                    <li>Check if you're getting quality sleep</li>
                </ul>
            </div>
        `;
    } else {
        status = 'Healthy Sleep Duration';
        recommendation = `
            <div class="alert alert-success">
                <strong>Great! You slept for ${sleepDuration.toFixed(1)} hours.</strong>
                <p>This is within the recommended sleep duration for adults.</p>
            </div>
        `;
    }

    return { status, recommendation, duration: sleepDuration };
};

// Mood Analysis and Recommendations
const getMoodRecommendations = (mood) => {
    const recommendations = {
        happy: {
            status: 'Positive Mood',
            tips: `
                <div class="alert alert-success">
                    <strong>Great mood! Here's how to maintain it:</strong>
                    <ul>
                        <li>Share your positivity with others</li>
                        <li>Journal about what made you happy today</li>
                        <li>Engage in activities you enjoy</li>
                        <li>Practice gratitude</li>
                    </ul>
                </div>
            `
        },
        calm: {
            status: 'Balanced Mood',
            tips: `
                <div class="alert alert-info">
                    <strong>Maintaining your calm state:</strong>
                    <ul>
                        <li>Continue mindfulness practices</li>
                        <li>Take regular breaks</li>
                        <li>Stay hydrated</li>
                        <li>Maintain your current routine</li>
                    </ul>
                </div>
            `
        },
        stressed: {
            status: 'Elevated Stress',
            tips: `
                <div class="alert alert-warning">
                    <strong>Stress Management Tips:</strong>
                    <ul>
                        <li>Try deep breathing exercises</li>
                        <li>Take a short walk</li>
                        <li>Practice progressive muscle relaxation</li>
                        <li>Consider talking to someone you trust</li>
                        <li>Take breaks from work</li>
                    </ul>
                </div>
            `
        },
        tired: {
            status: 'Low Energy',
            tips: `
                <div class="alert alert-warning">
                    <strong>Energy Boosting Tips:</strong>
                    <ul>
                        <li>Take a power nap (15-20 minutes)</li>
                        <li>Get some fresh air</li>
                        <li>Do light stretching</li>
                        <li>Stay hydrated</li>
                        <li>Check your sleep schedule</li>
                    </ul>
                </div>
            `
        },
        anxious: {
            status: 'Anxiety Management',
            tips: `
                <div class="alert alert-warning">
                    <strong>Anxiety Relief Tips:</strong>
                    <ul>
                        <li>Practice grounding exercises (5-4-3-2-1 method)</li>
                        <li>Try guided meditation</li>
                        <li>Write down your worries</li>
                        <li>Focus on what you can control</li>
                        <li>Consider talking to a professional</li>
                    </ul>
                </div>
            `
        }
    };

    return recommendations[mood] || {
        status: 'Mood Tracking',
        tips: '<div class="alert alert-info">Select your mood to get personalized recommendations.</div>'
    };
};

// Event Listeners
sleepForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const sleepTime = document.getElementById('sleep-time').value;
    const wakeTime = document.getElementById('wake-time').value;
    if (sleepTime && wakeTime) {
        // Get the current date
        const currentDate = new Date().toLocaleDateString();

    if (sleepTime && wakeTime) {
        const sleepAnalysis = analyzeSleep(sleepTime, wakeTime);
        
        
        // Save to state
        state.health.sleep.push({
            date: new Date().toISOString(),
            sleepTime,
            wakeTime,
            duration: sleepAnalysis.duration
        });
        saveState();

        // Update UI
        document.getElementById('sleep-analysis').innerHTML = sleepAnalysis.recommendation;
    }
}});
// Function to render sleep history
const renderSleepHistory = () => {
    const sleepHistoryBody = document.getElementById('sleep-history-body');
    sleepHistoryBody.innerHTML = state.health.sleep.map(entry => `
        <tr>
            <td>${entry.date}</td>
            <td>${entry.sleepTime}</td>
            <td>${entry.wakeTime}</td>
            <td>${entry.duration.toFixed(1)} hours</td>
            <td>${entry.duration < 6 ? 'Insufficient' : entry.duration > 10 ? 'Excessive' : 'Healthy'}</td>
        </tr>
    `).join('');
};

// Call renderSleepHistory to display the saved data on page load
renderSleepHistory();

moodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const mood = document.getElementById('mood-select').value;

    if (mood) {
        const moodRecommendation = getMoodRecommendations(mood);
        
        // Save to state
        state.health.mood.push({
            date: new Date().toISOString(),
            mood
        });
        saveState();

        // Update UI
        document.getElementById('mood-analysis').innerHTML = moodRecommendation.tips;
    }
});
// Event listener to clear sleep history
document.getElementById('clear-sleep-history').addEventListener('click', () => {
    // Clear the sleep data in the state and localStorage
    state.health.sleep = [];
    saveState(); // Save the empty state to localStorage

    // Clear the sleep history table
    document.getElementById('sleep-history-body').innerHTML = '<tr><td colspan="5" class="text-center">No sleep history available.</td></tr>';
});


// Initial render of the habits list when the page loads
renderHabits();
