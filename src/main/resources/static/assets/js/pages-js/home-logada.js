/*BOAS-VINDAS MESSAGEM*/
setTimeout(() => {
    const alerta = document.getElementById('boas-vindas');
    if (alerta) {
        alerta.style.display = 'none';
    }
}, 5000);


document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // 1. Controle de Mensagens (Alertas)
    // =============================================
    function setupAlerts() {
        // Fecha automaticamente as mensagens após 5 segundos
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 5000);
        });

        // Rola até a seção de vagas se houver mensagem
        if (window.location.hash === '#vagas' && document.querySelector('.alert')) {
            document.getElementById('vagas').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // =============================================
    // 2. Controle da Modal de Candidatura
    // =============================================
    function setupApplicationModal() {
        const applicationModal = document.getElementById('applicationModal');
        if (!applicationModal) return;

        const modalInstance = new bootstrap.Modal(applicationModal);

        applicationModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const vagaId = button.getAttribute('data-vaga-id');

            // Define o ID da vaga no campo hidden
            document.getElementById('hiddenVagaId').value = vagaId;

            // Reset do formulário
            const form = document.getElementById('applicationForm');
            form.reset();

            // Remove mensagens de erro anteriores
            const existingError = form.querySelector('.alert-danger');
            if (existingError) existingError.remove();

            // Buscar detalhes da vaga via API
            fetch(`/vagas/detalhes/${vagaId}`)
                .then(response => {
                if (!response.ok) throw new Error('Vaga não encontrada');
                return response.json();
            })
                .then(vaga => {
                // Preencher os dados da vaga na modal
                document.getElementById('jobTitle').textContent = vaga.titulo;
                document.getElementById('jobCompany').textContent =
                `${vaga.empresa} • ${vaga.localizacao}`;

                // Preencher badges
                const badgesContainer = document.getElementById('jobBadges');
                badgesContainer.innerHTML = `
                        <span class="badge badge-custom tempo">${vaga.tipoContrato}</span>
                        ${vaga.lgbtqiaFriendly ?
                          '<span class="badge badge-custom lgbt">LGBTQIA+</span>' : ''}
                        <span class="badge badge-custom area">${vaga.area}</span>
                    `;

                // Preencher descrição
                document.getElementById('jobDescription').innerHTML =
                `<p>${vaga.descricao}</p>`;
            })
                .catch(error => {
                console.error('Erro:', error);
                modalInstance.hide();

                // Mostra mensagem de erro global
                const errorAlert = document.createElement('div');
                errorAlert.className = 'alert alert-danger mt-3';
                errorAlert.textContent = 'Erro ao carregar detalhes da vaga';
                document.body.prepend(errorAlert);
                setTimeout(() => errorAlert.remove(), 5000);
            });
        });
    }

    // =============================================
    // 3. Controle do Formulário de Candidatura
    // =============================================
    function setupApplicationForm() {
        const applicationForm = document.getElementById('applicationForm');
        if (!applicationForm) return;

        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML =
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

            const formData = new FormData(this);

            fetch(this.action, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else if (!response.ok) {
                    throw new Error('Erro no servidor');
                }
                return response.text();
            })
                .catch(error => {
                console.error('Error:', error);
                const errorContainer = document.createElement('div');
                errorContainer.className = 'alert alert-danger mt-3';
                errorContainer.textContent = 'Erro ao enviar candidatura: ' +
                (error.message || 'Erro desconhecido');

                const existingError = this.querySelector('.alert-danger');
                if (existingError) {
                    existingError.replaceWith(errorContainer);
                } else {
                    this.appendChild(errorContainer);
                }
            })
                .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Candidatura';
            });
        });
    }

    // =============================================
    // 4. Máscara para Telefone
    // =============================================
    function setupPhoneMask() {
        const phoneInput = document.getElementById('applicantPhone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);

            // Formatação: (XX) XXXXX-XXXX
            if (value.length > 2) {
                value = `(${value.substring(0,2)}) ${value.substring(2)}`;
            }
            if (value.length > 10) {
                value = `${value.substring(0,10)}-${value.substring(10)}`;
            }

            e.target.value = value;
        });
    }

    // =============================================
    // 5. Verificação de Mensagens na URL
    // =============================================
    function checkUrlForMessages() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('sucesso') || urlParams.has('erro')) {
            document.getElementById('vagas')?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // =============================================
    // Inicialização de todos os componentes
    // =============================================
    setupAlerts();
    setupApplicationModal();
    setupApplicationForm();
    setupPhoneMask();
    checkUrlForMessages();
});


// CHAT
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do chat
    const chatToggle = document.getElementById('chatToggle');
    const chatPopup = document.getElementById('chatPopup');
    const closeChat = document.getElementById('closeChat');

    // Configuração do WebSocket
    const socket = new SockJS('/ws-chat');
    const stompClient = Stomp.over(socket);

    // Alternar visibilidade do chat
    chatToggle.addEventListener('click', function(e) {
        e.preventDefault();
        chatPopup.classList.toggle('d-none');
        chatPopup.classList.toggle('d-block');
    });

    // Fechar chat
    closeChat.addEventListener('click', function() {
        chatPopup.classList.add('d-none');
        chatPopup.classList.remove('d-block');
    });

    // Conexão WebSocket
    stompClient.connect({}, function(frame) {
        stompClient.subscribe('/topic/public', function(response) {
            const message = JSON.parse(response.body);
            showMessage(message.sender, message.content, 'received');
        });
    });

    // Enviar mensagem
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
    document.getElementById('userMessage').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const messageContent = document.getElementById('userMessage').value.trim();
        if (messageContent) {
            const chatMessage = {
                sender: 'Você',
                content: messageContent
            };

            stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
            showMessage('Você', messageContent, 'sent');
            document.getElementById('userMessage').value = '';
        }
    }

    function showMessage(sender, content, type) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} p-2 mb-2 rounded`;
        messageDiv.innerHTML = `<p class="mb-0"><strong>${sender}:</strong> ${content}</p>`;

        if (type === 'received') {
            messageDiv.classList.add('bg-light');
        } else {
            messageDiv.classList.add('bg-primary', 'text-white');
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
