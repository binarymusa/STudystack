const getApp = document.querySelector('#app');
const getAppqr = document.querySelector('#appshare');

getApp.addEventListener('mouseover', () => {
    // e.stopPropagation();
    getAppqr.classList.toggle('show');
});

document.addEventListener('mouseout', () => {
    e.stopPropagation();
    dropdown.classList.remove('show');
});

document.addEventListener('click', (e) => {
    if (!getApp.contains(e.target)) {
        getAppqr.classList.remove('show');
    }
});