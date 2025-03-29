const dayNight = document.querySelector('#daynight');
const sunIcon = dayNight.querySelector('.bi-sun');
const moonIcon = dayNight.querySelector('.bi-moon');
const bgclr = document.querySelector('#bodyclr');

dayNight.addEventListener('click', () =>  {
  bgclr.classList.toggle('white');
  sunIcon.classList.toggle('hidden');
  moonIcon.classList.toggle('hidden');
});