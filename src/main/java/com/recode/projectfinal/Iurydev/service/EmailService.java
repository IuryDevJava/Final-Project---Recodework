/*
package com.recode.projectfinal.Iurydev.service;

import com.recode.projectfinal.Iurydev.model.Candidatura;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remetente;

    public void enviarEmailConfirmacao(Candidatura candidatura) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(remetente);
            helper.setTo(candidatura.getEmailCandidato());
            helper.setSubject("Confirmação de Candidatura - " + candidatura.getVaga().getTitulo());

            String conteudo = "<html><body>"
                    + "<h2>Obrigado por se candidatar!</h2>"
                    + "<p>Sua candidatura para a vaga de <strong>" + candidatura.getVaga().getTitulo() + "</strong> "
                    + "na empresa <strong>" + candidatura.getVaga().getEmpresa() + "</strong> foi recebida com sucesso.</p>"
                    + "<p>Entraremos em contato em breve.</p>"
                    + "<br><p>Atenciosamente,<br>Equipe de Recrutamento</p>"
                    + "</body></html>";

            helper.setText(conteudo, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Falha ao enviar e-mail de confirmação", e);
        }
    }
}
*/
