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

  // Show the correct step and update buttons
  function showStep(stepNumber) {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index + 1 === stepNumber);
    });

    prevBtn.classList.toggle("hidden", stepNumber === 1);
    nextBtn.classList.toggle("hidden", stepNumber === totalSteps);
    predictBtn.classList.toggle("hidden", stepNumber !== totalSteps);
  }

  // Next button click
  nextBtn.addEventListener("click", () => {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  });

  // Previous button click
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

    // 1. Collect form data
    // The keys MUST match the *original* CSV columns
    const formData = new FormData(form);
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
      daytime_nap_duration: formData.get("daytime_nap_duration"),
      latenight_study_hours: formData.get("latenight_study_hours"),
    };

    // 2. Send to Flask server
    // We use '/predict' as the endpoint
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
        // 3. Display results
        resultText.innerText = result.prediction_text;
        confidenceText.innerText = `Confidence: ${(
          result.confidence * 100
        ).toFixed(0)}%`;

        // Show the correct icon or meme
        // We hide the original 'iconPoor' and show the meme instead
        iconPoor.classList.add("hidden");
        iconGood.classList.toggle("hidden", result.prediction === 0);
        memeImage.classList.toggle("hidden", result.prediction === 1); // Show meme if prediction is 0 (Poor)

        // Animate in the result card
        formContainer.classList.add("hidden");
        prevBtn.classList.add("hidden");
        predictBtn.classList.add("hidden");
        resultCard.classList.remove("hidden");
        resultCard.classList.add("fade-in");
      })
      .catch((error) => {
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

  // Reset button click
  resetBtn.addEventListener("click", () => {
    resultCard.classList.add("hidden");
    resultCard.classList.remove("fade-in");
    memeImage.classList.add("hidden"); // <-- Add this line
    formContainer.classList.remove("hidden");
    form.reset(); // Clear all form fields
    currentStep = 1;
    showStep(1);
  });

  // Initialize the form
  showStep(currentStep);
});
