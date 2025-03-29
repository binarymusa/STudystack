const btn = document.querySelector('#side');
const btncol = document.querySelector('#sc');
const rightbtn = btncol.querySelector('.bi-arrow-right')
const leftbtn = btncol.querySelector('.bi-arrow-left')
const sidebar = document.querySelector('#fix');
const mainContent = document.querySelector('#mainContent');

btn.addEventListener('click', function(){
    sidebar.classList.toggle('show');
    btn.classList.toggle('move');
    leftbtn.classList.toggle('hidden')
    rightbtn.classList.toggle('hidden')

    if (sidebar.classList.contains('show')) {
        mainContent.classList.remove('col-lg-10');
        mainContent.classList.add('col-lg-9');         
        mainContent.classList.add('ms-auto');       
        // mainContent.style.marginLeft = 'auto'
    } else {
        mainContent.classList.remove('col-lg-9');
        mainContent.classList.add('col-lg-10');
        mainContent.classList.remove('ms-auto');
        mainContent.style.marginLeft = '';
    }   
});

btncol.addEventListener('mouseover', () =>  {
    btncol.style.backgroundColor = '#e2e2e2bb';
});
btncol.addEventListener('mouseleave', () =>  {
    btncol.style.backgroundColor = ''; 
    btncol.style.display = ''
});

sidebar.addEventListener('mouseover', () =>  {
    sidebar.style.opacity = '1';
});
sidebar.addEventListener('mouseleave', () =>  {
    sidebar.style.opacity = '';
});