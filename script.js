document.addEventListener("DOMContentLoaded", () => {
    const baseFrequencyInput = document.getElementById("base-frequency");
    const tuningSystemSelect = document.getElementById("tuning-system");
    const exerciseTypeSelect = document.getElementById("exercise-type");
    const playSoundButton = document.getElementById("play-sound");
    const startTrainingButton = document.getElementById("start-training");
    const optionsContainer = document.getElementById("options-container");
    const correctScoreDisplay = document.getElementById("correct-score");
    const incorrectScoreDisplay = document.getElementById("incorrect-score");
    const feedback = document.getElementById("feedback");

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

    function playChord(baseFreq, intervals) {
        intervals.forEach((interval, i) => {
            setTimeout(() => playTone(baseFreq * interval, 1), i * 500);
        });
    }

    function generateExercise() {
        const baseFreq = parseFloat(baseFrequencyInput.value) || 440;
        const type = exerciseTypeSelect.value;

        if (type === "interval") {
            const step = Math.floor(Math.random() * 12) - 6;
            currentAnswer = `${step} steps`;
            const freq = baseFreq * tuningSystems[tuningSystemSelect.value](step);
            playTone(freq);
            updateOptions(["-6 steps", "0 steps", "6 steps"]);

        } else if (type === "scale") {
            const scales = ["Major", "Minor", "Pentatonic", "Chromatic"];
            currentAnswer = scales[Math.floor(Math.random() * scales.length)];
            playTone(baseFreq);
            updateOptions(scales);

        } else if (type === "chord") {
            const chords = ["Major", "Minor", "Diminished"];
            currentAnswer = chords[Math.floor(Math.random() * chords.length)];
            const chordIntervals = {
                "Major": [1, 1.25, 1.5],
                "Minor": [1, 1.2, 1.5],
                "Diminished": [1, 1.2, 1.4]
            };
            playChord(baseFreq, chordIntervals[currentAnswer]);
            updateOptions(chords);
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
            correctScoreDisplay.textContent = correctScore;
        } else {
            incorrectScore++;
            incorrectScoreDisplay.textContent = incorrectScore;
        }

        setTimeout(() => {
            feedback.textContent = "";
            generateExercise();
        }, 1000);
    }

    startTrainingButton.addEventListener("click", generateExercise);
    playSoundButton.addEventListener("click", generateExercise);
});