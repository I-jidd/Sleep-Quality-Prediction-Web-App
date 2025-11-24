// ===== Configuration =====
const API_ENDPOINT = "/predict";

// ===== State Management =====
let currentStep = 1;
const totalSteps = 3;

// ===== DOM Elements =====
const elements = {
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  predictBtn: document.getElementById("predictBtn"),
  resultOverlay: document.getElementById("resultOverlay"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  resetBtn: document.getElementById("resetBtn"),
  avatarMale: document.getElementById("avatar-male"),
  avatarFemale: document.getElementById("avatar-female"),
  avatarText: document.getElementById("avatarText"),
  avatarDialogue: document.getElementById("avatarDialogue"),
  healthBar: document.getElementById("healthBar"),
  stressDisplay: document.getElementById("stressDisplay"),
  caffeineDisplay: document.getElementById("caffeineDisplay"),
  screenDisplay: document.getElementById("screenDisplay"),
  predictionResult: document.getElementById("predictionResult"),
  confidenceBar: document.getElementById("confidenceBar"),
  confidenceText: document.getElementById("confidenceText"),
  stepDots: [
    document.getElementById("step1Dot"),
    document.getElementById("step2Dot"),
    document.getElementById("step3Dot"),
  ],
};

// Form inputs
const inputs = {
  sex: document.getElementById("sex"),
  academic_level: document.getElementById("academic_level"),
  living_arrangement: document.getElementById("living_arrangement"),
  Caffeine_Intake_Frequency: document.getElementById(
    "Caffeine_Intake_Frequency"
  ),
  screen_time_before_sleep: document.getElementById("screen_time_before_sleep"),
  smoking_Frequency: document.getElementById("smoking_Frequency"),
  physical_activity_frequency: document.getElementById(
    "physical_activity_frequency"
  ),
  alcohol_consumption_frequency: document.getElementById(
    "alcohol_consumption_frequency"
  ),
  stress_level: document.getElementById("stress_level"),
  daytime_nap_duration: document.getElementById("daytime_nap_duration"),
  study_start_time: document.getElementById("study_start_time"),
  study_end_time: document.getElementById("study_end_time"),
};

// ===== Avatar Dialogue Messages =====
const dialogues = {
  welcome: "Ready when you are!",
  stress: {
    "Low stress": "Feeling pretty relaxed!",
    "Moderate stress": "A bit stressed, but managing.",
    "High stress": "Help! Too much stress...",
  },
  caffeine: {
    Never: "No coffee for me!",
    "Almost Never": "Rarely drink caffeine.",
    Sometimes: "Coffee time!",
    "Fairly Often": "I love my coffee!",
    "Very Often": "Caffeine is life!",
    Always: "Running on coffee!",
  },
  prediction_loading: "Analyzing your data...",
  good_sleep: "Great news ahead!",
  poor_sleep: "Hmm, concerning...",
};

// ===== Navigation Functions =====
function updateStepVisibility() {
  // Hide all steps
  for (let i = 1; i <= totalSteps; i++) {
    document.getElementById(`step-${i}`).classList.remove("active");
  }

  // Show current step
  document.getElementById(`step-${currentStep}`).classList.add("active");

  // Update step dots
  elements.stepDots.forEach((dot, index) => {
    if (index < currentStep) {
      dot.className = "w-3 h-3 bg-rpg-gold";
    } else {
      dot.className = "w-3 h-3 bg-gray-600";
    }
  });

  // Button visibility
  elements.prevBtn.style.visibility = currentStep === 1 ? "hidden" : "visible";

  if (currentStep === totalSteps) {
    elements.nextBtn.classList.add("hidden");
    elements.predictBtn.classList.remove("hidden");
  } else {
    elements.nextBtn.classList.remove("hidden");
    elements.predictBtn.classList.add("hidden");
  }

  // Update avatar dialogue based on step
  updateAvatarForStep();
}

function updateAvatarForStep() {
  switch (currentStep) {
    case 1:
      updateAvatarDialogue("Tell me about yourself!");
      break;
    case 2:
      updateAvatarDialogue("What are your habits?");
      break;
    case 3:
      updateAvatarDialogue("Almost done! Final stats!");
      break;
  }
}

// ===== Avatar Functions =====
function updateAvatar() {
  const sex = inputs.sex.value;
  const level = inputs.academic_level.value;
  const stress = inputs.stress_level.value;

  // Toggle avatar gender
  if (sex === "Male") {
    elements.avatarMale.classList.remove("hidden");
    elements.avatarFemale.classList.add("hidden");
  } else {
    elements.avatarMale.classList.add("hidden");
    elements.avatarFemale.classList.remove("hidden");
  }

  const currentAvatar =
    sex === "Male" ? elements.avatarMale : elements.avatarFemale;

  // Stress animations
  if (stress === "High stress") {
    currentAvatar.style.animation = "wiggle 0.5s ease-in-out infinite";
  } else {
    currentAvatar.style.animation = "none";
  }

  updateStats();
}

function updateAvatarDialogue(message) {
  elements.avatarText.innerText = message;
}

function updateStats() {
  const stress = inputs.stress_level.value;
  const caffeine = inputs.Caffeine_Intake_Frequency.value;
  const screen = inputs.screen_time_before_sleep.value;

  // Update stat displays
  elements.stressDisplay.innerText = stress
    .replace(" stress", "")
    .toUpperCase();
  elements.caffeineDisplay.innerText = caffeine.toUpperCase();
  elements.screenDisplay.innerText = screen.toUpperCase();

  // Update health bar based on negative factors
  let healthPercentage = 100;

  if (stress === "High stress") healthPercentage -= 30;
  else if (stress === "Moderate stress") healthPercentage -= 15;

  if (caffeine === "Very Often" || caffeine === "Always")
    healthPercentage -= 20;
  else if (caffeine === "Fairly Often") healthPercentage -= 10;

  if (screen === "More than 2 hours") healthPercentage -= 25;
  else if (screen === "1 - 2 hours") healthPercentage -= 15;

  healthPercentage = Math.max(0, healthPercentage);
  elements.healthBar.style.width = healthPercentage + "%";

  // Change health bar color based on level
  if (healthPercentage > 70) {
    elements.healthBar.style.background =
      "linear-gradient(90deg, #22c55e 0%, #84cc16 100%)";
  } else if (healthPercentage > 40) {
    elements.healthBar.style.background =
      "linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)";
  } else {
    elements.healthBar.style.background =
      "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)";
  }
}

// ===== Time Display Helper =====
function formatTimeToAMPM(time24) {
  // Convert 24-hour format (HH:MM) to 12-hour format with am/pm
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "pm" : "am";
  const hours12 = hours % 12 || 12; // Convert 0 to 12
  return `${hours12}:${minutes.toString().padStart(2, "0")}${period}`;
}

function updateStudyTimeDisplay() {
  const startTime = inputs.study_start_time.value;
  const endTime = inputs.study_end_time.value;

  const startFormatted = formatTimeToAMPM(startTime);
  const endFormatted = formatTimeToAMPM(endTime);

  const displayElement = document.getElementById("studyTimeDisplay");
  displayElement.textContent = `Time range: ${startFormatted} - ${endFormatted}`;
}

function formatStudyTimeForAPI(startTime, endTime) {
  // Format as "10:00pm - 1:00am" for your preprocessing.py
  const startFormatted = formatTimeToAMPM(startTime);
  const endFormatted = formatTimeToAMPM(endTime);
  return `${startFormatted} - ${endFormatted}`;
}

// ===== Prediction Function =====
async function makePrediction() {
  // Show loading overlay
  elements.loadingOverlay.classList.remove("hidden");
  elements.loadingOverlay.classList.add("flex");
  updateAvatarDialogue(dialogues.prediction_loading);

  // Format study time as "10:00pm - 1:00am" for preprocessing.py
  const studyTimeString = formatStudyTimeForAPI(
    inputs.study_start_time.value,
    inputs.study_end_time.value
  );

  // Gather form data - send raw time string to backend
  const formData = {
    sex: inputs.sex.value,
    academic_level: inputs.academic_level.value,
    living_arrangement: inputs.living_arrangement.value,
    Caffeine_Intake_Frequency: inputs.Caffeine_Intake_Frequency.value,
    screen_time_before_sleep: inputs.screen_time_before_sleep.value,
    smoking_Frequency: inputs.smoking_Frequency.value,
    physical_activity_frequency: inputs.physical_activity_frequency.value,
    alcohol_consumption_frequency: inputs.alcohol_consumption_frequency.value,
    daytime_nap_duration: inputs.daytime_nap_duration.value,
    latenight_study_hours: studyTimeString, // Send as string like "10:00pm - 1:00am"
    stress_level: inputs.stress_level.value,
  };

  console.log("Sending prediction request with data:", formData);

  try {
    // Make API call to your Flask backend
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Prediction result from API:", result);

    // Simulate delay for effect
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Hide loading, show result
    elements.loadingOverlay.classList.add("hidden");
    elements.loadingOverlay.classList.remove("flex");

    // Display the REAL model prediction
    displayResult(result);
  } catch (error) {
    console.error("Error making prediction:", error);
    console.error("Error details:", error.message);

    // Hide loading
    elements.loadingOverlay.classList.add("hidden");
    elements.loadingOverlay.classList.remove("flex");

    // Show error message to user
    alert(
      "Failed to get prediction from server. Please make sure:\n" +
        "1. Flask server is running\n" +
        "2. API endpoint is correct: " +
        API_ENDPOINT +
        "\n" +
        "3. Check browser console for details\n\n" +
        "Error: " +
        error.message
    );
  }
}

function displayResult(result) {
  const isGoodSleep = result.prediction === 1;
  const confidence = Math.round(result.confidence * 100);

  // Update result text
  elements.predictionResult.innerText = result.prediction_text.toUpperCase();
  elements.predictionResult.className = isGoodSleep
    ? "text-green-400 text-base sm:text-xl mb-4 animate-pulse"
    : "text-red-400 text-base sm:text-xl mb-4 animate-pulse";

  // Update confidence
  elements.confidenceText.innerText = confidence + "%";
  elements.confidenceBar.style.width = "0%";

  // Animate confidence bar
  setTimeout(() => {
    elements.confidenceBar.style.width = confidence + "%";
  }, 100);

  // Update avatar dialogue
  updateAvatarDialogue(
    isGoodSleep ? dialogues.good_sleep : dialogues.poor_sleep
  );

  // Show result overlay
  elements.resultOverlay.classList.remove("hidden");
  elements.resultOverlay.classList.add("flex");

  // Play success sound (optional)
  playSound(isGoodSleep ? "success" : "warning");
}

// ===== Sound Effects =====
function playSound(type) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === "success") {
    // Happy ascending tones
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
  } else if (type === "warning") {
    // Descending tones
    oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
    oscillator.frequency.setValueAtTime(329.63, audioContext.currentTime + 0.1); // E4
    oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime + 0.2); // C4
  } else if (type === "click") {
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  }

  oscillator.type = "square"; // Retro square wave
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.3
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

// ===== Background Music System =====
let backgroundMusic = null;
let musicPlaying = false;
let musicEnabled = false;

function initBackgroundMusic() {
  if (!backgroundMusic) {
    try {
      backgroundMusic = new Audio();

      // Use Flask's built-in static folder
      backgroundMusic.src = "/static/sound/retro-arcade-game-music-297305.mp3";
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.3; // Set to 30% volume (adjust as needed)

      // Handle loading errors
      backgroundMusic.addEventListener("error", (e) => {
        console.error("Error loading music file from:", backgroundMusic.src);
        console.error(
          "Make sure the file is in: static/sound/retro-arcade-game-music-297305.mp3"
        );
        console.error("Error details:", e);

        const musicIcon = document.getElementById("musicIcon");
        const musicText = document.getElementById("musicText");
        musicIcon.innerText = "❌";
        musicText.innerText = "FILE NOT FOUND";
      });

      // Log when music is ready
      backgroundMusic.addEventListener("canplaythrough", () => {
        console.log("✓ Background music loaded successfully!");
      });

      console.log("Attempting to load music from:", backgroundMusic.src);
    } catch (error) {
      console.error("Failed to create Audio element:", error);
      return false;
    }
  }
  return true;
}

async function playBackgroundMusic() {
  if (!initBackgroundMusic()) {
    console.error("Failed to initialize music");
    return;
  }

  try {
    // Reset to beginning if needed
    backgroundMusic.currentTime = 0;

    // Play the audio
    await backgroundMusic.play();

    musicPlaying = true;
    musicEnabled = true;
    console.log("Music started playing");
  } catch (error) {
    console.error("Failed to play music:", error);
    // Show error in UI
    const musicIcon = document.getElementById("musicIcon");
    const musicText = document.getElementById("musicText");
    musicIcon.innerText = "❌";
    musicText.innerText = "PLAY FAILED";
  }
}

function stopBackgroundMusic() {
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    musicPlaying = false;
    console.log("Music stopped");
  }
}

async function toggleMusic() {
  const musicToggle = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");
  const musicText = document.getElementById("musicText");

  if (musicPlaying) {
    stopBackgroundMusic();
    musicEnabled = false;
    musicIcon.innerText = "🔇";
    musicText.innerText = "MUSIC OFF";
    musicToggle.classList.remove("animate-pulse");
  } else {
    await playBackgroundMusic();
    if (musicPlaying) {
      musicIcon.innerText = "🔊";
      musicText.innerText = "MUSIC ON";
      musicToggle.classList.add("animate-pulse");
    }
  }
}

// ===== Event Listeners =====
document.getElementById("musicToggle").addEventListener("click", toggleMusic);

elements.nextBtn.addEventListener("click", () => {
  if (currentStep < totalSteps) {
    currentStep++;
    updateStepVisibility();
    playSound("click");
  }
});

elements.prevBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    updateStepVisibility();
    playSound("click");
  }
});

elements.predictBtn.addEventListener("click", () => {
  makePrediction();
  playSound("click");
});

elements.resetBtn.addEventListener("click", () => {
  elements.resultOverlay.classList.add("hidden");
  elements.resultOverlay.classList.remove("flex");
  currentStep = 1;
  updateStepVisibility();
  updateAvatar();
  playSound("click");
});

// Input change listeners
inputs.sex.addEventListener("change", updateAvatar);
inputs.academic_level.addEventListener("change", updateAvatar);
inputs.stress_level.addEventListener("change", () => {
  updateAvatar();
  updateAvatarDialogue(dialogues.stress[inputs.stress_level.value]);
});
inputs.Caffeine_Intake_Frequency.addEventListener("change", () => {
  updateStats();
  updateAvatarDialogue(
    dialogues.caffeine[inputs.Caffeine_Intake_Frequency.value]
  );
});
inputs.screen_time_before_sleep.addEventListener("change", updateStats);
inputs.smoking_Frequency.addEventListener("change", updateStats);
inputs.study_start_time.addEventListener("change", updateStudyTimeDisplay);
inputs.study_end_time.addEventListener("change", updateStudyTimeDisplay);

// ===== Initialize =====
updateStepVisibility();
updateAvatar();
updateStudyTimeDisplay(); // Initialize time display

// Music starts OFF by default (user must click to enable)
console.log("DreamWell initialized. Click music button to start audio.");
