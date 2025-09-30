document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Utility to create activity cards with participants section
  function createActivityCard(activityName, activityData) {
    const card = document.createElement('div');
    card.className = 'activity-card';

    // Activity title and description
    card.innerHTML = `
      <h4>${activityName}</h4>
      <p>${activityData.description}</p>
      <p><strong>Schedule:</strong> ${activityData.schedule}</p>
      <p><strong>Max Participants:</strong> ${activityData.max_participants}</p>
    `;

    // Participants section
    const participantsSection = document.createElement('div');
    participantsSection.className = 'participants-section';

    const participantsTitle = document.createElement('h4');
    participantsTitle.textContent = 'Participants';
    participantsSection.appendChild(participantsTitle);

    const participantsList = document.createElement('ul');
    participantsList.className = 'participants-list';

    if (activityData.participants.length === 0) {
      const emptyMsg = document.createElement('li');
      emptyMsg.textContent = 'No participants yet.';
      emptyMsg.style.fontStyle = 'italic';
      participantsList.appendChild(emptyMsg);
    } else {
      activityData.participants.forEach(email => {
        const li = document.createElement('li');
        li.textContent = email;
        participantsList.appendChild(li);
      });
    }

    participantsSection.appendChild(participantsList);
    card.appendChild(participantsSection);

    return card;
  }

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = createActivityCard(name, details);
        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
