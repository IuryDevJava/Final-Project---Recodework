package com.recode.projectfinal.Iurydev.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class OpenAIService {

    @Value("${openai.api.key:}")
    private String apiKey;

    private boolean apiEnabled = true;

    // Respostas completas e organizadas
    private static final Map<String, String> RESPONSE_MAP = Map.ofEntries(
            // Menu principal
            Map.entry("ajuda", getHelpResponse()),

            // Opção 1 - Direitos
            Map.entry("1", getRightsResponse()),
            Map.entry("direitos", getRightsResponse()),

            // Opção 2 - Saúde Mental
            Map.entry("2", getMentalHealthResponse()),
            Map.entry("saude mental", getMentalHealthResponse()),
            Map.entry("saúde mental", getMentalHealthResponse()),

            // Opção 3 - Contatos
            Map.entry("3", getContactsResponse()),
            Map.entry("contatos", getContactsResponse()),

            // Opção 4 - Acolhimento
            Map.entry("4", getEmotionalSupportResponse()),
            Map.entry("acolhimento", getEmotionalSupportResponse()),
            Map.entry("emocional", getEmotionalSupportResponse())
    );

    private static final Map<String, String> KEYWORD_RESPONSES = Map.of(
            "cvv", "Centro de Valorização da Vida - Ligue 188 (24h, gratuito)",
            "antra", "Associação Nacional de Travestis e Transexuais\n📞 (21) 9876-5432",
            "lgbt", "Disque Direitos Humanos - Ligue 100"
    );

    // Cache simples para evitar processamento repetido
    private final Map<String, String> responseCache = new ConcurrentHashMap<>();

    public String getChatResponse(String userMessage) {
        String lowerMessage = userMessage.toLowerCase().trim();

        // Verifica no cache primeiro
        if (responseCache.containsKey(lowerMessage)) {
            return responseCache.get(lowerMessage);
        }

        // 1. Verifica respostas exatas
        if (RESPONSE_MAP.containsKey(lowerMessage)) {
            return cacheAndReturn(lowerMessage, RESPONSE_MAP.get(lowerMessage));
        }

        // 2. Verifica palavras-chave
        for (Map.Entry<String, String> entry : KEYWORD_RESPONSES.entrySet()) {
            if (lowerMessage.contains(entry.getKey())) {
                return cacheAndReturn(lowerMessage, entry.getValue());
            }
        }

        // 3. Se API está habilitada e tem chave, tenta OpenAI
        if (apiEnabled && apiKey != null && !apiKey.isBlank()) {
            try {
                String apiResponse = tryOpenAI(userMessage);
                return cacheAndReturn(lowerMessage, apiResponse);
            } catch (Exception e) {
                log.warn("Falha na API OpenAI, desativando temporariamente", e);
                apiEnabled = false; // Desativa após falha
            }
        }

        // 4. Fallback genérico
        return cacheAndReturn(lowerMessage, getDefaultResponse(lowerMessage));
    }

    private String cacheAndReturn(String key, String value) {
        responseCache.put(key, value);
        return value;
    }

    // Métodos auxiliares para construir respostas organizadas
    private static String getHelpResponse() {
        return """
            🌈 Como posso te ajudar? Escolha uma opção:
            
            1️⃣ <b>Direitos LGBTQIA+</b> - Informações jurídicas
            2️⃣ <b>Saúde Mental</b> - Apoio psicológico
            3️⃣ <b>Contatos</b> - Organizações especializadas
            4️⃣ <b>Acolhimento Emocional</b> - Suporte imediato
            
            Digite o <b>número</b> ou <b>assunto</b> de interesse""";
    }

    private static String getRightsResponse() {
        return """
            ⚖️ <b>Direitos LGBTQIA+ no Brasil</b>
            
            • Casamento igualitário
            • Mudança de nome e gênero
            • Criminalização da LGBTfobia
            • Adoção por casais homoafetivos
            
            📌 <i>Para orientação jurídica:</i>
            ANTRA - (21) 9876-5432
            Advogados pela Diversidade""";
    }

    private static String getMentalHealthResponse() {
        return """
            💙 <b>Apoio em Saúde Mental</b>
            
            <b>CVV - Centro de Valorização da Vida</b>
            📞 Ligue 188 (24h, gratuito)
            
            <b>Psicólogos especializados:</b>
            • Rede Nacional de Psicólogos LGBTQIA+
            • Casule - (21) 9988-7766
            
            <b>Apoio Online:</b>
            • Psicologia Viva
            • Telavita""";
    }

    private static String getContactsResponse() {
        return """
            📞 <b>Contatos Importantes</b>
            
            <b>ANTRA</b> - (21) 9876-5432
            <b>ABGLT</b> - (11) 3344-5566
            <b>Grupo Dignidade</b> - (41) 3322-1100
            
            <b>Apoio Local:</b>
            • Casa 1 (SP)
            • Grupo Arco-Íris (RJ)""";
    }

    private static String getEmotionalSupportResponse() {
        return """
            🤗 <b>Acolhimento Emocional</b>
            
            Você não está sozinho(a/e)! 
            
            <b>Conversar agora:</b>
            📞 CVV - 188 (24h)
            💬 Chat online: www.cvv.org.br
            
            <b>Grupos de apoio:</b>
            • Aliança Nacional LGBTI+
            • Rede de Apoio LGBTQIA+""";
    }

    private static String getDefaultResponse(String input) {
        return """
            🌈 Não entendi completamente sua solicitação.
            
            Você pode:
            1. Digitar <b>'ajuda'</b> para ver opções
            2. Especificar melhor sua necessidade
            3. Entrar em contato diretamente:
               📧 atendimento@recode.org.br
               📞 (21) 2345-6789""";
    }

    private String tryOpenAI(String userMessage) throws Exception {
        String requestBody = String.format("""
            {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "Você é o Ally, assistente do projeto Recodework. Seja acolhedor, use emojis e responda em português brasileiro de forma breve."},
                    {"role": "user", "content": "%s"}
                ],
                "temperature": 0.7,
                "max_tokens": 150
            }
            """, userMessage.replace("\"", "\\\""));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(response.body());
            return node.path("choices").get(0)
                    .path("message").path("content").asText();
        } else {
            throw new Exception(response.body());
        }
    }

}