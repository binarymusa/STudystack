
document.addEventListener('DOMContentLoaded', function(){
    var alert = document.querySelector('.alert');
    setTimeout(() => {
        alert.parentNode.removeChild(alert);
    }, 3000) 
})