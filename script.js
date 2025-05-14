document.addEventListener("DOMContentLoaded", () => {
    const baseFrequencyInput = document.getElementById("base-frequency");
    const tuningSystemSelect = document.getElementById("tuning-system");
    const playSoundButton = document.getElementById("play-sound");
    const optionsButtons = document.querySelectorAll(".option");
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
        "ed3": (steps) => Math.pow(3, steps / 12),
        "ji": (ratio) => ratio // Ratios will be predefined
    };

    const justIntonationRatios = [
        [1, 1],
        [9, 8],
        [5, 4],
        [4, 3],
        [3, 2],
        [5, 3],
        [15, 8],
        [2, 1]
    ];

    function playTone(frequency, duration = 1) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.3;

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }

    function generateExercise() {
        const baseFrequency = parseFloat(baseFrequencyInput.value) || 440;
        const tuningSystem = tuningSystemSelect.value;

        let step, frequency, ratio;

        if (tuningSystem === "ji") {
            ratio = justIntonationRatios[Math.floor(Math.random() * justIntonationRatios.length)];
            frequency = baseFrequency * (ratio[0] / ratio[1]);
            currentAnswer = `${ratio[0]}/${ratio[1]}`;
        } else {
            step = Math.floor(Math.random() * 12) - 6;  // Random step between -6 and +6
            const multiplier = tuningSystems[tuningSystem](step);
            frequency = baseFrequency * multiplier;
            currentAnswer = `${step} steps`;
        }

        console.log("Generated Frequency:", frequency);
        return frequency;
    }

    playSoundButton.addEventListener("click", () => {
        const frequency = generateExercise();
        playTone(frequency);
    });

    optionsButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const selectedAnswer = e.target.textContent;

            if (selectedAnswer === currentAnswer) {
                correctScore++;
                correctScoreDisplay.textContent = correctScore;
            } else {
                incorrectScore++;
                incorrectScoreDisplay.textContent = incorrectScore;
            }
        });
    });
});