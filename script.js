document.addEventListener("DOMContentLoaded", () => {
    const baseFrequencyInput = document.getElementById("base-frequency");
    const tuningSystemSelect = document.getElementById("tuning-system");
    const exerciseTypeSelect = document.getElementById("exercise-type");
    const playSoundButton = document.getElementById("play-sound");
    const startTrainingButton = document.getElementById("start-training");
    const optionsContainer = document.getElementById("options-container");
    const correctScoreDisplay = document.getElementById("correct-score");
    const incorrectScoreDisplay = document.getElementById("incorrect-score");
    const instruction = document.getElementById("instruction");

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let correctScore = 0;
    let incorrectScore = 0;
    let currentAnswer = null;

    const tuningSystems = {
        "12edo": (steps) => Math.pow(2, steps / 12),
        "24edo": (steps) => Math.pow(2, steps / 24),
        "31edo": (steps) => Math.pow(2, steps / 31),
        "ed3": (steps) => Math.pow(3, steps / 12),
        "ji": (ratio) => ratio
    };

    const justIntonationRatios = [
        [1, 1], [9, 8], [5, 4], [4, 3], [3, 2], [5, 3], [15, 8], [2, 1]
    ];

    function playTone(frequency, duration = 1) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }

    function generateIntervalExercise(baseFrequency) {
        const step = Math.floor(Math.random() * 12) - 6;
        const tuningSystem = tuningSystemSelect.value;
        const ratio = tuningSystems[tuningSystem](step);
        const intervalFrequency = baseFrequency * ratio;

        currentAnswer = `${step} steps`;
        return intervalFrequency;
    }

    function generateScaleExercise(baseFrequency) {
        const scales = ["Major", "Minor", "Pentatonic", "Chromatic"];
        currentAnswer = scales[Math.floor(Math.random() * scales.length)];
        return baseFrequency * (Math.random() + 0.5);
    }

    function generateChordExercise(baseFrequency) {
        const chords = ["Major", "Minor", "Diminished", "Augmented"];
        currentAnswer = chords[Math.floor(Math.random() * chords.length)];
        return baseFrequency * (Math.random() + 0.5);
    }

    function generateExercise() {
        const baseFrequency = parseFloat(baseFrequencyInput.value) || 440;
        const exerciseType = exerciseTypeSelect.value;
        let frequency;

        switch (exerciseType) {
            case "interval":
                instruction.textContent = "Identify the interval:";
                frequency = generateIntervalExercise(baseFrequency);
                updateOptions(["-6 steps", "-3 steps", "0 steps", "3 steps", "6 steps"]);
                break;
            case "scale":
                instruction.textContent = "Identify the scale:";
                frequency = generateScaleExercise(baseFrequency);
                updateOptions(["Major", "Minor", "Pentatonic", "Chromatic"]);
                break;
            case "chord":
                instruction.textContent = "Identify the chord:";
                frequency = generateChordExercise(baseFrequency);
                updateOptions(["Major", "Minor", "Diminished", "Augmented"]);
                break;
        }

        playTone(frequency);
    }

    function updateOptions(options) {
        optionsContainer.innerHTML = "";
        options.forEach(option => {
            const button = document.createElement("button");
            button.className = "option";
            button.textContent = option;
            button.addEventListener("click", () => handleAnswer(option));
            optionsContainer.appendChild(button);
        });
    }

    function handleAnswer(selectedAnswer) {
        if (selectedAnswer === currentAnswer) {
            correctScore++;
            correctScoreDisplay.textContent = correctScore;
        } else {
            incorrectScore++;
            incorrectScoreDisplay.textContent = incorrectScore;
        }
    }

    startTrainingButton.addEventListener("click", generateExercise);
    playSoundButton.addEventListener("click", generateExercise);
});