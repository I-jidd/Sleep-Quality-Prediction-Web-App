document.addEventListener("DOMContentLoaded", () => {
  let currentStep = 1;
  const totalSteps = 3;

  // Get all elements
  const form = document.getElementById("sleepForm");
  const formContainer = document.getElementById("formContainer");
  const steps = [
    document.getElementById("step-1"),
    document.getElementById("step-2"),
    document.getElementById("step-3"),
  ];
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const predictBtn = document.getElementById("predictBtn");
  const predictText = document.getElementById("predictText");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const resultCard = document.getElementById("resultCard");
  const resultText = document.getElementById("resultText");
  const confidenceText = document.getElementById("confidenceText");
  const iconPoor = document.getElementById("iconPoor");
  const iconGood = document.getElementById("iconGood");
  const resetBtn = document.getElementById("resetBtn");
  const memeImage = document.getElementById("memeImage");

  function showStep(stepNumber) {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index + 1 === stepNumber);
    });

    prevBtn.classList.toggle("hidden", stepNumber === 1);
    nextBtn.classList.toggle("hidden", stepNumber === totalSteps);
    predictBtn.classList.toggle("hidden", stepNumber !== totalSteps);
  }

  nextBtn.addEventListener("click", () => {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Show loading spinner
    predictText.classList.add("hidden");
    loadingSpinner.classList.remove("hidden");
    predictBtn.disabled = true;

    // Collect form data FIRST
    const formData = new FormData(form);

    // Format the time range for late-night study
    const startTime = formData.get("latenight_study_start");
    const endTime = formData.get("latenight_study_end");
    let latenightStudyFormatted = "";

    if (startTime && endTime) {
      // Convert "22:00" to "10pm" and "01:00" to "1am"
      const formatTime = (time24) => {
        const [hours, minutes] = time24.split(":");
        let h = parseInt(hours);

        // For late-night times after midnight (00:00 - 11:59), it's AM
        // For evening times (12:00 - 23:59), it's PM
        if (h >= 12) {
          // 12:00-23:59 range
          if (h > 12) h = h - 12; // 13-23 becomes 1-11
          // h === 12 stays as 12
          return minutes === "00" ? `${h}pm` : `${h}:${minutes}pm`;
        } else {
          // 00:00-11:59 range
          if (h === 0) h = 12; // Midnight becomes 12am
          return minutes === "00" ? `${h}am` : `${h}:${minutes}am`;
        }
      };

      latenightStudyFormatted = `${formatTime(startTime)}-${formatTime(
        endTime
      )}`;
    }

    // Format nap duration
    const napDuration = formData.get("daytime_nap_duration");
    const napFormatted = napDuration ? `${napDuration} minutes` : "0";

    // Build the data object
    const data = {
      sex: formData.get("sex"),
      academic_level: formData.get("academic_level"),
      living_arrangement: formData.get("living_arrangement"),
      Caffeine_Intake_Frequency: formData.get("Caffeine_Intake_Frequency"),
      screen_time_before_sleep: formData.get("screen_time_before_sleep"),
      smoking_Frequency: formData.get("smoking_Frequency"),
      physical_activity_frequency: formData.get("physical_activity_frequency"),
      alcohol_consumption_frequency: formData.get(
        "alcohol_consumption_frequency"
      ),
      stress_level: formData.get("stress_level"),
      daytime_nap_duration: napFormatted,
      latenight_study_hours: latenightStudyFormatted,
    };

    console.log("Sending data:", data); // Debug log

    // Send to Flask server
    fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        // Display results
        resultText.innerText = result.prediction_text;
        confidenceText.innerText = `Confidence: ${(
          result.confidence * 100
        ).toFixed(0)}%`;

        iconPoor.classList.add("hidden");
        iconGood.classList.toggle("hidden", result.prediction === 0);
        memeImage.classList.toggle("hidden", result.prediction === 1);

        formContainer.classList.add("hidden");
        prevBtn.classList.add("hidden");
        predictBtn.classList.add("hidden");
        resultCard.classList.remove("hidden");
        resultCard.classList.add("fade-in");
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
        resultText.innerText = "Prediction Failed";
        confidenceText.innerText = "Please try again later.";

        iconPoor.classList.remove("hidden");
        iconGood.classList.add("hidden");

        formContainer.classList.add("hidden");
        prevBtn.classList.add("hidden");
        predictBtn.classList.add("hidden");
        resultCard.classList.remove("hidden");
        resultCard.classList.add("fade-in");
      })
      .finally(() => {
        // Reset button state
        predictText.classList.remove("hidden");
        loadingSpinner.classList.add("hidden");
        predictBtn.disabled = false;
      });
  });

  // Reset button
  resetBtn.addEventListener("click", () => {
    resultCard.classList.add("hidden");
    resultCard.classList.remove("fade-in");
    memeImage.classList.add("hidden");
    formContainer.classList.remove("hidden");
    form.reset();
    currentStep = 1;
    showStep(1);
  });

  // Initialize the form
  showStep(currentStep);
});
