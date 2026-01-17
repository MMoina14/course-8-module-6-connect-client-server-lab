// API base URL
const API_URL = "http://localhost:5000";

// DOM elements
const eventForm = document.querySelector("#event-form");
const eventList = document.querySelector("#event-list");
const titleInput = document.querySelector("#title");
const errorMessage = document.querySelector("#error-message");

/**
 * Fetch and display all events from the server
 */
function loadEvents() {
    fetch(`${API_URL}/events`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(events => {
            // Clear the list
            eventList.innerHTML = "";
            
            // Render each event
            if (events.length === 0) {
                const li = document.createElement("li");
                li.textContent = "No events yet. Add one above!";
                li.style.color = "#999";
                eventList.appendChild(li);
            } else {
                events.forEach(renderEvent);
            }
        })
        .catch(error => {
            console.error("Error fetching events:", error);
            eventList.innerHTML = "<li style='color: #e74c3c;'>Failed to load events. Make sure the server is running.</li>";
        });
}

/**
 * Render a single event to the DOM
 * @param {Object} event - Event object with id and title
 */
function renderEvent(event) {
    const li = document.createElement("li");
    li.textContent = event.title;
    li.setAttribute("data-id", event.id);
    eventList.appendChild(li);
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
    setTimeout(() => {
        errorMessage.classList.remove("show");
    }, 3000);
}

/**
 * Handle form submission
 */
eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    
    // Validate input on client side
    if (!title) {
        showError("Please enter an event title");
        return;
    }
    
    if (title.length < 3) {
        showError("Event title must be at least 3 characters");
        return;
    }
    
    // Send POST request to add new event
    fetch(`${API_URL}/events`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ title })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(newEvent => {
        // Clear the loading message if it exists
        const loadingMsg = eventList.querySelector(".loading");
        if (loadingMsg) {
            eventList.innerHTML = "";
        }
        
        // Check for "No events" message and remove it
        const noEventsMsg = eventList.querySelector("li");
        if (noEventsMsg && noEventsMsg.textContent.includes("No events yet")) {
            eventList.innerHTML = "";
        }
        
        // Render the new event
        renderEvent(newEvent);
        
        // Clear the form
        titleInput.value = "";
        titleInput.focus();
        
        console.log("Event added successfully:", newEvent);
    })
    .catch(error => {
        console.error("Error adding event:", error);
        showError("Failed to add event. Please try again.");
    });
});

// Load events when page loads
document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded. Fetching events from server...");
    loadEvents();
});