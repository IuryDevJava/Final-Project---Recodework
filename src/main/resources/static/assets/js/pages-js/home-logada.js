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



/*
// CHAT
document.addEventListener('DOMContentLoaded', function() {
  const chatToggle = document.getElementById('chatToggle');
  const chatPopup = document.getElementById('chatPopup');
  const closeChat = document.getElementById('closeChat');
  const sendMessage = document.getElementById('sendMessage');
  const userMessage = document.getElementById('userMessage');
  const chatMessages = document.getElementById('chatMessages');

  // Alternar visibilidade do chat
  chatToggle.addEventListener('click', function(e) {
    e.preventDefault();
    chatPopup.style.display = chatPopup.style.display === 'flex' ? 'none' : 'flex';
  });

  // Fechar chat
  closeChat.addEventListener('click', function() {
    chatPopup.style.display = 'none';
  });

  // Enviar mensagem
  sendMessage.addEventListener('click', function() {
    sendMessageToChat();
  });

  // Enviar com Enter
  userMessage.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessageToChat();
    }
  });

  function sendMessageToChat() {
    if (userMessage.value.trim() !== '') {
      // Adiciona mensagem do usuário
      const userMsgDiv = document.createElement('div');
      userMsgDiv.className = 'message sent';
      userMsgDiv.innerHTML = `<p>${userMessage.value}</p>`;
      chatMessages.appendChild(userMsgDiv);

      // Simula resposta após 1 segundo
      setTimeout(() => {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'message received';
        replyDiv.innerHTML = '<p>Obrigado por sua mensagem. Nossa equipe responderá em breve.</p>';
        chatMessages.appendChild(replyDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);

      userMessage.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
});*/
