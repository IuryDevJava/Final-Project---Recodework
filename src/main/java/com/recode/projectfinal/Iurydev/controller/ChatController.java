package com.recode.projectfinal.Iurydev.controller;

import com.recode.projectfinal.Iurydev.model.ChatMessage;
import com.recode.projectfinal.Iurydev.service.OpenAIService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Slf4j
@Controller
public class ChatController {

    private final OpenAIService openAIService;

    private static final Map<String, String> GREETINGS = Map.of(
            "oi", "👋 Olá! Sou o Ally, assistente virtual do Projeto Recodework. Digite 'ajuda' para ver como posso te ajudar!",
            "olá", "👋 Olá! Sou o Ally, assistente virtual do Projeto Recodework. Digite 'ajuda' para ver como posso te ajudar!",
            "ola", "👋 Olá! Sou o Ally, assistente virtual do Projeto Recodework. Digite 'ajuda' para ver como posso te ajudar!",
            "bom dia", "🌞 Bom dia! Digite 'ajuda' para ver nossas opções de apoio!",
            "boa tarde", "☀️ Boa tarde! Como posso te ajudar hoje?",
            "boa noite", "🌙 Boa noite! Estou aqui se precisar conversar"
    );

    private static final Map<String, String> FAREWELLS = Map.of(
            "tchau", "Até logo! Lembre-se: você é importante! 🌈",
            "adeus", "Até mais! Se precisar, estarei aqui. 💖",
            "até mais", "Até logo! Cuide-se! 😊",
            "vlw", "Por nada! Estou aqui quando precisar! 👍",
            "valew", "Por nada! Fico feliz em ajudar! 😊"
    );

    public ChatController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage message) {
        if (message.getSender().equals("Sistema")) {
            message.setContent("[Importante] " + message.getContent());
        }

        try {
            log.info("Mensagem recebida: {}", message.getContent());
            String content = message.getContent().toLowerCase().trim();

            // Respostas para saudações
            if (GREETINGS.containsKey(content)) {
                return createResponse(GREETINGS.get(content));
            }

            // Respostas para despedidas
            if (FAREWELLS.containsKey(content)) {
                return createResponse(FAREWELLS.get(content));
            }

            // Processa a mensagem
            String response = openAIService.getChatResponse(message.getContent());
            return createResponse(response);

        } catch (Exception e) {
            log.error("Erro no chat", e);
            return createResponse("""
                    ⚠️ Estou com dificuldades técnicas no momento. 
                    
                    Você pode:
                    1. Tentar novamente em alguns instantes
                    2. Contatar nosso suporte:
                       📧 atendimento@recode.org.br
                       📞 (21) 2345-6789
                    3. Acessar nosso site: https://recode.org.br/""");
        }
    }

    private ChatMessage createResponse(String content) {
        return new ChatMessage("Ally", content.replace("\n", "<br>"));
    }
}