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
    // 6. Sistema de Chat com WebSocket e OpenAI
    function setupChatSystem() {

        // Elementos
        const chatElements = {
            toggle: document.getElementById('chatToggle'),
            popup: document.getElementById('chatPopup'),
            closeBtn: document.getElementById('closeChat'),
            sendBtn: document.getElementById('sendMessage'),
            input: document.getElementById('userMessage'),
            messages: document.getElementById('chatMessages')
        };

        // Estado
        const chatState = {
            connected: false,
            stompClient: null,
            reconnectAttempts: 0,
            maxAttempts: 5
        };

        // Auxiliares
        const chatHelpers = {
            showMessage: (sender, text, type) => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${type} p-3 mb-2 rounded`;

                // Ícones diferentes para cada tipo
                const icon = type === 'received' ? '🌈' : '👤';

                messageDiv.innerHTML = `
                <div class="message-header d-flex align-items-center mb-1">
                    <span class="message-icon me-2">${icon}</span>
                    <strong class="message-sender">${sender}</strong>
                </div>
                <div class="message-content">${text}</div>
            `;

                // Estilos diferentes
                if (type === 'received') {
                    messageDiv.classList.add('bg-light', 'text-dark');
                } else {
                    messageDiv.classList.add('bg-light', 'text-dark');
                }

                chatElements.messages.appendChild(messageDiv);
                chatElements.messages.scrollTop = chatElements.messages.scrollHeight;
            },

            showTyping: () => {
                const typingDiv = document.createElement('div');
                typingDiv.id = 'typing-indicator';
                typingDiv.className = 'typing-message p-2 mb-2';
                typingDiv.innerHTML = `
                <div class="typing-content d-flex align-items-center">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <span class="ms-2">Digitando...</span>
                </div>
            `;
                chatElements.messages.appendChild(typingDiv);
                chatElements.messages.scrollTop = chatElements.messages.scrollHeight;
            },

            hideTyping: () => {
                const indicator = document.getElementById('typing-indicator');
                if (indicator) indicator.remove();
            },

            setLoading: (isLoading) => {
                chatElements.sendBtn.disabled = isLoading;
                chatElements.sendBtn.innerHTML = isLoading
                    ? '<span class="spinner-border spinner-border-sm"></span> Enviando...'
                    : 'Enviar';
            }
        };

        // Conexão WebSocket
        const connectWebSocket = () => {
            chatHelpers.showMessage('Sistema', 'Conectando ao chat...', 'system');

            const socket = new SockJS('/ws-chat');
            chatState.stompClient = Stomp.over(socket);

            chatState.stompClient.connect({},
                (frame) => {
                    chatState.connected = true;
                    chatState.reconnectAttempts = 0;
                    chatHelpers.showMessage('Sistema', 'Conectado com sucesso!', 'system');

                    // Assinar tópico
                    chatState.stompClient.subscribe('/topic/public', (message) => {
                        const { sender, content } = JSON.parse(message.body);
                        chatHelpers.hideTyping();
                        chatHelpers.showMessage(sender, content, 'received');
                    });

                    // Mensagem de boas-vindas
                    setTimeout(() => {
                        chatHelpers.showMessage(
                            'Ally',
                            'Olá! Sou o Ally, seu assistente virtual. Digite "ajuda" para ver como posso te ajudar! 😊',
                            'received'
                        );
                    }, 500);
                },
                (error) => {
                    chatState.connected = false;
                    chatState.reconnectAttempts++;

                    if (chatState.reconnectAttempts <= chatState.maxAttempts) {
                        const delay = Math.min(chatState.reconnectAttempts * 3000, 10000);
                        chatHelpers.showMessage(
                            'Sistema',
                            `Falha na conexão. Tentando novamente (${chatState.reconnectAttempts}/${chatState.maxAttempts})...`,
                            'system'
                        );
                        setTimeout(connectWebSocket, delay);
                    } else {
                        chatHelpers.showMessage(
                            'Sistema',
                            'Não foi possível conectar. Por favor, recarregue a página.',
                            'error'
                        );
                    }
                }
            );
        };

        // Enviar mensagem
        const sendMessage = () => {
            const message = chatElements.input.value.trim();
            if (!message) return;

            // Mostrar mensagem do usuário
            chatHelpers.showMessage('Você', message, 'sent');
            chatElements.input.value = '';
            chatHelpers.setLoading(true);
            chatHelpers.showTyping();

            try {
                chatState.stompClient.send(
                    "/app/chat.send",
                    {},
                    JSON.stringify({ sender: 'Você', content: message })
                );
            } catch (e) {
                chatHelpers.showMessage(
                    'Sistema',
                    'Erro ao enviar mensagem. Tentando reconectar...',
                    'error'
                );
                connectWebSocket();
            } finally {
                setTimeout(() => chatHelpers.setLoading(false), 1000);
            }
        };

        // Eventos
        const setupEvents = () => {
            chatElements.toggle?.addEventListener('click', (e) => {
                e.preventDefault();
                chatElements.popup.classList.toggle('d-none');
                if (!chatState.stompClient && chatElements.popup.classList.contains('d-block')) {
                    connectWebSocket();
                }
            });

            chatElements.closeBtn?.addEventListener('click', () => {
                chatElements.popup.classList.add('d-none');
            });

            chatElements.sendBtn?.addEventListener('click', sendMessage);
            chatElements.input?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        };

        // Inicialização
        setupEvents();
    }

    // =============================================
    // Inicialização de todos os componentes
    // =============================================
    setupAlerts();
    setupApplicationModal();
    setupApplicationForm();
    setupPhoneMask();
    checkUrlForMessages();
    setupChatSystem();
});