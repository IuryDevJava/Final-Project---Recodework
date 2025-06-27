function toggleSenha(inputId, iconId) {
    const senhaInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        senhaInput.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const alerts = document.querySelectorAll('.custom-alert');
        alerts.forEach(alert => {
            alert.remove();
        });
    }, 5000);
});