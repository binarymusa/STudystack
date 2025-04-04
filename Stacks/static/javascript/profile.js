const userProfile = document.querySelector('#profile');
const dropdown = document.querySelector('#profileDropdown');

userProfile.addEventListener('click', (e) =>  {
    e.stopPropagation();
    dropdown.classList.toggle('show');
    
});
document.addEventListener('click', () => {
    dropdown.classList.remove('show');
});
