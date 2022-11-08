import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  fpInput: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  daysField: document.querySelector('[data-days]'),
  hoursField: document.querySelector('[data-hours]'),
  minutesField: document.querySelector('[data-minutes]'),
  secondsField: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    onFpCloseCheck(selectedDates);
  },
};
const fp = flatpickr(refs.fpInput, options);

class Timer {
  constructor({ selectedTime, onStart, onTick, onStop }) {
    this.selectedTime = selectedTime;
    this.onStart = onStart;
    this.onTick = onTick;
    this.onStop = onStop;
    this.start();
  }

  start() {
    this.onStart();
    const timerId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = this.convertMs(this.selectedTime - currentTime);

      if (deltaTime.seconds < 0) {
        clearInterval(timerId);
        this.onStop();
        return;
      }

      this.onTick(deltaTime);
    }, 1000);
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    // Remaining seconds
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }
}

refs.startBtn.addEventListener('click', () => {
  const timer = new Timer({
    selectedTime: fp.selectedDates[0],
    onStart: startTimer,
    onTick: updateTimerFace,
    onStop: stopTimer,
  });
});

function startTimer() {
  refs.startBtn.setAttribute('disabled', '');
  refs.fpInput.setAttribute('disabled', '');
}

function stopTimer() {
  refs.fpInput.removeAttribute('disabled');
}

function updateTimerFace({ days, hours, minutes, seconds }) {
  refs.daysField.textContent = days;
  refs.hoursField.textContent = hours;
  refs.minutesField.textContent = minutes;
  refs.secondsField.textContent = seconds;
}

function onFpCloseCheck(selectedDates) {
  if (selectedDates[0] <= Date.now()) {
    return Notiflix.Notify.failure('Please choose a date in the future');
  }
  refs.startBtn.removeAttribute('disabled');
}
