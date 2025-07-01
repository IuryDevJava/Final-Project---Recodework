package com.recode.projectfinal.Iurydev.controller;


import com.recode.projectfinal.Iurydev.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage message) {
        // Aqui você pode integrar com Dialogflow ou outra IA
        if (message.getContent().contains("como você prefere ser chamada")) {
            return new ChatMessage("Chat LGBTQIA+", "Eu me chamo Acolhe, seu assistente virtual. E você, como prefere ser chamado(a/e)? 🌈");
        }
        return new ChatMessage("Chat LGBTQIA+", "Estou aqui para te ajudar! Conte-me mais sobre suas necessidades.");
    }

}
