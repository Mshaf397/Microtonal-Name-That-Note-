document.addEventListener("DOMContentLoaded", () => {
    const baseFrequencyInput = document.getElementById("base-frequency");
    const tuningSystemSelect = document.getElementById("tuning-system");
    const exerciseTypeSelect = document.getElementById("exercise-type");
    const difficultySelect = document.getElementById("difficulty");
    const playSoundButton = document.getElementById("play-sound");
    const startTrainingButton = document.getElementById("start-training");
    const optionsContainer = document.getElementById("options-container");
    const feedback = document.getElementById("feedback");
    const correctScoreDisplay = document.getElementById("correct-score");
    const incorrectScoreDisplay = document.getElementById("incorrect-score");

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let correctScore = 0;
    let incorrectScore = 0;
    let currentAnswer = null;

    const tuningSystems = {
        "12edo": (steps) => Math.pow(2, steps / 12),
        "24edo": (steps) => Math.pow(2, steps / 24),
        "31edo": (steps) => Math.pow(2, steps / 31),
        "ed3": (steps) => Math.pow(2, steps / 13),
        "ji": (ratio) => ratio
    };

    const scales = {
        "Major": [1, 1.125, 1.25, 1.333, 1.5, 1.667, 1.875, 2],
        "Minor": [1, 1.125, 1.2, 1.333, 1.5, 1.6, 1.875, 2],
        "Pentatonic": [1, 1.25, 1.5, 2, 2.5], // Fixed to 5 distinct pitch classes
        "Chromatic": {
            "24edo": Array.from({ length: 24 }, (_, i) => Math.pow(2, i / 24)), // Quarter tones
            "31edo": Array.from({ length: 31 }, (_, i) => Math.pow(2, i / 31)), // 31 steps (diesis)
            "ji": [16/15, 9/8, 6/5, 5/4, 4/3, 64/45, 3/2, 8/5, 5/3, 16/9, 15/8, 2/1] // Just Intonation chromatic
        }
    };

    function playTone(frequency, duration = 1) {
        const osc = audioContext.createOscillator();
        osc.type = "sine";
        osc.frequency.value = frequency;
        osc.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + duration);
    }

    function playScale(baseFreq, intervals) {
        intervals.forEach((interval, i) => {
            setTimeout(() => playTone(baseFreq * interval, 0.7), i * 500);
        });
    }

    function generateExercise() {
        const baseFreq = parseFloat(baseFrequencyInput.value) || 440;
        const type = exerciseTypeSelect.value;
        const tuning = tuningSystemSelect.value;

        if (type === "scale") {
            const scaleNames = Object.keys(scales);
            currentAnswer = scaleNames[Math.floor(Math.random() * scaleNames.length)];
            
            if (currentAnswer === "Chromatic") {
                playScale(baseFreq, scales.Chromatic[tuning] || scales.Chromatic["ji"]);
                updateOptions(Object.keys(scales.Chromatic));
            } else {
                playScale(baseFreq, scales[currentAnswer]);
                updateOptions([currentAnswer]);
            }
        }
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
        feedback.style.color = selectedAnswer === currentAnswer ? "#00bfa6" : "#ff5252";
        feedback.textContent = selectedAnswer === currentAnswer ? "Correct!" : "Incorrect.";

        if (selectedAnswer === currentAnswer) {
            correctScore++;
        } else {
            incorrectScore++;
        }

        correctScoreDisplay.textContent = correctScore;
        incorrectScoreDisplay.textContent = incorrectScore;

        setTimeout(() => {
            feedback.textContent = "";
            generateExercise();
        }, 1000);
    }

    startTrainingButton.addEventListener("click", generateExercise);
    playSoundButton.addEventListener("click", generateExercise);
});