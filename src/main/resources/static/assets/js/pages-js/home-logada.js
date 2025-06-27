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

/*BOAS-VINDAS MESSAGEM*/
setTimeout(() => {
    const alerta = document.getElementById('boas-vindas');
    if (alerta) {
        alerta.style.display = 'none';
    }
}, 5000);
