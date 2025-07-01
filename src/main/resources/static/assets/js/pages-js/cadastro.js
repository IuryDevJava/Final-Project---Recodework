function toggleSenha(inputId, iconId) {
    const senhaInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    const senhaVisivel = senhaInput.type === 'text';

    senhaInput.type = senhaVisivel ? 'password' : 'text';

    icon.classList.remove(senhaVisivel ? 'fa-eye' : 'fa-eye-slash');
    icon.classList.add(senhaVisivel ? 'fa-eye-slash' : 'fa-eye');
}