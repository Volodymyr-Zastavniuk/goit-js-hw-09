const refs = {
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
};
let timerId = null;

refs.startBtn.addEventListener('click', () => {
  toggleBtnsState();

  timerId = setInterval(() => {
    setBgColor(getRandomHexColor());
  }, 1000);
});

refs.stopBtn.addEventListener('click', () => {
  toggleBtnsState();
  clearInterval(timerId);
});

function toggleBtnsState() {
  refs.startBtn.toggleAttribute('disabled');
  refs.stopBtn.toggleAttribute('disabled');
}

function setBgColor(color) {
  document.body.style.backgroundColor = color;
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
