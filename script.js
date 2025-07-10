window.onload = function() {
  const countdownEl = document.getElementById("countdown");
  const nextBtn = document.getElementById("nextBtn");
  if (countdownEl && nextBtn) {
    let time = 20;
    const timer = setInterval(() => {
      time--;
      countdownEl.textContent = time;
      if (time <= 0) {
        clearInterval(timer);
        nextBtn.classList.remove("disabled");
      }
    }, 1000);
  }
};
