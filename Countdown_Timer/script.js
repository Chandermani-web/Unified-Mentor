let timer = null;
let targetTime = null;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

startBtn.addEventListener("click", function() {
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    if (!date || !time) {
        alert("Please select both date and time!");
        return;
    }

    targetTime = new Date(`${date}T${time}:00`).getTime();
    startCountdown();

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;
});

stopBtn.addEventListener("click", function() {
    clearInterval(timer);
    startBtn.disabled = false; // allow resume
    stopBtn.disabled = true;
});

resetBtn.addEventListener("click", function() {
    clearInterval(timer);
    document.getElementById("days").innerText = "00";
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";
    document.getElementById("message").innerText = "";

    document.getElementById("date").value = "";
    document.getElementById("time").value = "";

    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = true;
});

function startCountdown() {
    timer = setInterval(function() {
        let now = new Date().getTime();
        let distance = targetTime - now;

        if (distance < 0) {
            clearInterval(timer);
            document.getElementById("message").innerText = "🎉 Time's up!";
            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";
            return;
        }

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

    }, 1000);
}
