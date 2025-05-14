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
        "53edo": (steps) => Math.pow(2, steps / 53),
        "ed3": (steps) => Math.pow(3, steps / 13),
        "ji": (ratio) => ratio
    };

    const scales = {
        "Major": [1, 1.125, 1.25, 1.333, 1.5, 1.667, 1.875, 2],
        "Minor": [1, 1.125, 1.2, 1.333, 1.5, 1.6, 1.875, 2],
        "Pentatonic": [1, 1.2, 1.333, 1.5, 1.8, 2],  // Fixed to 5 distinct pitch classes
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

    function playChord(baseFreq, intervals) {
        const osc1 = audioContext.createOscillator();
        osc1.type = "sine";
        osc1.frequency.value = baseFreq * intervals[0];
        osc1.connect(audioContext.destination);
        osc1.start();
        osc1.stop(audioContext.currentTime + 1);

        const osc2 = audioContext.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = baseFreq * intervals[1];
        osc2.connect(audioContext.destination);
        osc2.start();
        osc2.stop(audioContext.currentTime + 1);

        const osc3 = audioContext.createOscillator();
        osc3.type = "sine";
        osc3.frequency.value = baseFreq * intervals[2];
        osc3.connect(audioContext.destination);
        osc3.start();
        osc3.stop(audioContext.currentTime + 1);
    }

    function generateExercise() {
        const baseFreq = parseFloat(baseFrequencyInput.value) || 440;
        const type = exerciseTypeSelect.value;
        const tuning = tuningSystemSelect.value;

        if (type === "chord") {
            // Example of a chord (Major triad, can be adjusted for complexity)
            const chordIntervals = [1, 5/4, 3/2]; // 1st, major 3rd, perfect 5th for a major chord
            playChord(baseFreq, chordIntervals);
            updateOptions(["Major Chord", "Minor Chord", "Diminished Chord"]);
        } else {
            // For scales or intervals, existing functionality would apply.
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