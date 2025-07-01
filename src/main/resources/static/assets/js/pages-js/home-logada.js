document.addEventListener('DOMContentLoaded', function() {
    // Fecha mensagem de boas-vindas após 5 segundos
    setTimeout(() => {
        const alerta = document.getElementById('boas-vindas');
        if (alerta) {
            alerta.style.display = 'none';
        }
    }, 5000);

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
    // 6. Sistema de Chat com WebSocket e Toasts
    // =============================================
    function setupChatSystem() {
        // Elementos do DOM
        const chatElements = {
            toggle: document.getElementById('chatToggle'),
            popup: document.getElementById('chatPopup'),
            closeBtn: document.getElementById('closeChat'),
            sendBtn: document.getElementById('sendMessage'),
            input: document.getElementById('userMessage'),
            messages: document.getElementById('chatMessages')
        };

        // Estado do chat
        const chatState = {
            connected: false,
            stompClient: null,
            reconnectAttempts: 0,
            maxAttempts: 5
        };

        // Funções auxiliares
        const chatHelpers = {
            showMessage: (sender, text, type) => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${type} p-3 mb-2 rounded`;

                const icon = type === 'received' ? '🌈' : '👤';
                messageDiv.innerHTML = `
                    <div class="message-header d-flex align-items-center mb-1">
                        <span class="message-icon me-2">${icon}</span>
                        <strong class="message-sender">${sender}</strong>
                    </div>
                    <div class="message-content">${text}</div>
                `;

                messageDiv.classList.add(type === 'received' ? 'bg-light' : 'bg-light', 'text-dark');
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

        // Função para mostrar toasts
        function showNewMessageToast(message) {
            // Remove toasts anteriores
            document.querySelectorAll('.chat-notification-toast').forEach(toast => {
                toast.remove();
            });

            // Cria novo toast
            const toast = document.createElement('div');
            toast.className = 'chat-notification-toast';
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'polite');
            toast.innerHTML = `
                <span>${message.length > 50 ? 'Você tem uma nova mensagem' : message}</span>
                <button class="toast-close-btn" aria-label="Fechar">×</button>
            `;

            // Posicionamento preciso relativo ao botão do chat
            const chatBtn = document.getElementById('chatToggle');
            if (chatBtn) {
                const btnRect = chatBtn.getBoundingClientRect();
                toast.style.bottom = `${window.innerHeight - btnRect.top + 15}px`;
                toast.style.right = `${window.innerWidth - btnRect.right - 10}px`;
            }

            document.body.appendChild(toast);

            // Fechamento automático após 5 segundos
            const autoClose = setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 5000);

            // Fechar ao clicar no botão
            toast.querySelector('.toast-close-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                clearTimeout(autoClose);
                toast.remove();
            });

            // Abrir chat ao clicar no toast
            toast.addEventListener('click', () => {
                clearTimeout(autoClose);
                toast.remove();
                chatElements.popup.classList.remove('d-none');
                document.getElementById('unreadBadge').classList.add('d-none');
            });
        }

        function updateUnreadBadge() {
            const badge = document.getElementById('unreadBadge');
            if (badge) {
                badge.classList.remove('d-none');
            }
        }

        function resetUnreadBadge() {
            const badge = document.getElementById('unreadBadge');
            if (badge) {
                badge.classList.add('d-none');
            }
        }

        // Conexão WebSocket
        const connectWebSocket = () => {
            const socket = new SockJS('/ws-chat');
            chatState.stompClient = Stomp.over(socket);

            chatState.stompClient.connect({},
                (frame) => {
                    chatState.connected = true;
                    chatState.reconnectAttempts = 0;

                    // Subscreve para receber mensagens
                    chatState.stompClient.subscribe('/topic/public', (message) => {
                        const { sender, content } = JSON.parse(message.body);
                        chatHelpers.hideTyping();
                        chatHelpers.showMessage(sender, content, 'received');

                        // Mostra toast se chat estiver fechado
                        if (chatElements.popup.classList.contains('d-none')) {
                            showNewMessageToast(content);
                            updateUnreadBadge();
                        }
                    });

                    // Mensagem inicial apenas quando o chat é aberto
                    if (!chatElements.popup.classList.contains('d-none')) {
                        chatHelpers.showMessage(
                            'Ally',
                            'Olá! Eu sou o Ally, seu assistente virtual. Como posso te ajudar hoje? 😊',
                            'received'
                        );
                    }
                },
                (error) => {
                    chatState.connected = false;
                    if (chatState.reconnectAttempts < chatState.maxAttempts) {
                        setTimeout(connectWebSocket, 3000);
                        chatState.reconnectAttempts++;
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

        // Configuração de eventos
        const setupEvents = () => {
            chatElements.toggle?.addEventListener('click', (e) => {
                e.preventDefault();
                chatElements.popup.classList.toggle('d-none');

                if (!chatState.stompClient && !chatElements.popup.classList.contains('d-none')) {
                    connectWebSocket();
                }

                // Resetar badge quando o chat é aberto
                if (!chatElements.popup.classList.contains('d-none')) {
                    resetUnreadBadge();
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

        // Inicialização do sistema
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