import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function addLeadingZero(value) {
  return value < 10 ? `0${value}` : value;
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.querySelector('[data-start]');
  const dateTimePicker = flatpickr('#datetime-picker', {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      const currentDate = new Date();

      if (selectedDate <= currentDate) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
        startButton.disabled = true;
      } else {
        startButton.disabled = false;
      }
    },
  });

  startButton.addEventListener('click', function () {
    const selectedDate = dateTimePicker.selectedDates[0].getTime();
    const now = new Date().getTime();
    const timeLeft = selectedDate - now;

    if (timeLeft <= 0) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      return;
    }

    startButton.disabled = true;
    startButton.classList.add('active');
    dateTimePicker._input.disabled = true;

    startTimer(timeLeft);
  });

  function startTimer(duration) {
    const timer = document.querySelector('.timer');

    const timerInterval = setInterval(function () {
      const { days, hours, minutes, seconds } = convertMs(duration);

      timer.querySelector('[data-days]').textContent = addLeadingZero(days);
      timer.querySelector('[data-hours]').textContent = addLeadingZero(hours);
      timer.querySelector('[data-minutes]').textContent =
        addLeadingZero(minutes);
      timer.querySelector('[data-seconds]').textContent =
        addLeadingZero(seconds);

      if (duration <= 0) {
        clearInterval(timerInterval);
        startButton.disabled = false;
        startButton.classList.remove('active');
        dateTimePicker._input.disabled = false;
      }

      duration -= 1000;
    }, 1000);
  }
});
