document.addEventListener("DOMContentLoaded", () => {
    const baseFrequencyInput = document.getElementById("base-frequency");
    const tuningSystemSelect = document.getElementById("tuning-system");
    const playSoundButton = document.getElementById("play-sound");
    const startTrainingButton = document.getElementById("start-training");

    let correctScore = 0;
    let incorrectScore = 0;

    startTrainingButton.addEventListener("click", () => {
        console.log("Base Frequency:", baseFrequencyInput.value);
        console.log("Tuning System:", tuningSystemSelect.value);
        // Further implementation to be added...
    });

    playSoundButton.addEventListener("click", () => {
        console.log("Playing sound...");
        // Sound generation logic will be added here.
    });
});