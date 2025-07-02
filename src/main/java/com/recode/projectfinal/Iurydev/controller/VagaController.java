package com.recode.projectfinal.Iurydev.controller;

import com.recode.projectfinal.Iurydev.dto.CandidaturaDTO;
import com.recode.projectfinal.Iurydev.model.Candidatura;
import com.recode.projectfinal.Iurydev.model.Usuario;
import com.recode.projectfinal.Iurydev.model.Vaga;
import com.recode.projectfinal.Iurydev.repository.CandidaturaRepository;
import com.recode.projectfinal.Iurydev.repository.UsuarioRepository;
import com.recode.projectfinal.Iurydev.repository.VagaRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
@RequestMapping("/vagas")
public class VagaController {

    private final VagaRepository vagaRepository;
    private final CandidaturaRepository candidaturaRepository;
    private final UsuarioRepository usuarioRepository;
    private static final String UPLOAD_DIR = "uploads/curriculos/";

    @Autowired
    public VagaController(VagaRepository vagaRepository,
                          CandidaturaRepository candidaturaRepository,
                          UsuarioRepository usuarioRepository) {
        this.vagaRepository = vagaRepository;
        this.candidaturaRepository = candidaturaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/home-logada")
    public String listarVagas(Model model, HttpSession session) {

        if (!model.containsAttribute("sucesso") && session.getAttribute("sucesso") != null) {
            model.addAttribute("sucesso", session.getAttribute("sucesso"));
            session.removeAttribute("sucesso");
        }
        if (!model.containsAttribute("erro") && session.getAttribute("erro") != null) {
            model.addAttribute("erro", session.getAttribute("erro"));
            session.removeAttribute("erro");
        }

        model.addAttribute("vagas", vagaRepository.findAll());

        // Adiciona o nome do usuário (opcional)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && !auth.getName().equals("anonymousUser")) {
            model.addAttribute("nomeUsuario", auth.getName());
        }

        return "pages/home-logada";
    }

    @GetMapping("/buscar")
    public String buscarVagas(@RequestParam String termo, Model model) {
        model.addAttribute("vagas", vagaRepository.findByTituloContainingIgnoreCase(termo));
        model.addAttribute("termoBusca", termo);
        return "pages/home-logada";
    }

    @GetMapping("/detalhes/{id}")
    @ResponseBody
    public ResponseEntity<Vaga> detalhesVaga(@PathVariable Long id) {
        return vagaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/candidatar")
    public String candidatar(@ModelAttribute CandidaturaDTO candidaturaDTO,
                             @RequestParam("curriculo") MultipartFile curriculo,
                             RedirectAttributes redirectAttributes,
                             HttpServletRequest request) {

        try {
            // Validação do arquivo
            if (curriculo.isEmpty()) {
                throw new IllegalArgumentException("O currículo é obrigatório");
            }

            String curriculoPath = salvarCurriculo(curriculo);

            // Buscar a vaga
            Vaga vaga = vagaRepository.findById(candidaturaDTO.getVagaId())
                    .orElseThrow(() -> new IllegalArgumentException("Vaga não encontrada"));

            // Buscar o usuário logado
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String emailUsuario = auth.getName();

            Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário logado não encontrado"));

            // Criar e salvar candidatura
            Candidatura candidatura = new Candidatura();
            candidatura.setVaga(vaga);
            candidatura.setUsuario(usuario);
            candidatura.setNomeCandidato(candidaturaDTO.getNomeCandidato());
            candidatura.setEmailCandidato(candidaturaDTO.getEmailCandidato());
            candidatura.setTelefoneCandidato(candidaturaDTO.getTelefoneCandidato());
            candidatura.setCurriculoPath(curriculoPath);
            candidatura.setMensagem(candidaturaDTO.getMensagem());

            candidaturaRepository.save(candidatura);

            redirectAttributes.addFlashAttribute("sucesso",
                    "Candidatura enviada para: " + vaga.getTitulo());
            request.getSession().setAttribute("sucesso",
                    "Candidatura enviada para: " + vaga.getTitulo());

            return "redirect:/vagas/home-logada#vagas";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("erro", "❌ Erro: " + e.getMessage());
            request.getSession().setAttribute("erro", "❌ Erro: " + e.getMessage());
            return "redirect:/vagas/home-logada#vagas";
        }
    }

    private String salvarCurriculo(MultipartFile curriculo) throws IOException {
        // Criar diretório se não existir
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Validar tipo de arquivo
        String originalFilename = curriculo.getOriginalFilename();
        if (originalFilename == null ||
                (!originalFilename.endsWith(".pdf") && !originalFilename.endsWith(".docx") && !originalFilename.endsWith(".doc"))) {
            throw new IllegalArgumentException("Formato de arquivo inválido. Apenas PDF, DOC ou DOCX são permitidos");
        }

        String fileName = System.currentTimeMillis() + "_" + originalFilename;
        Path filePath = uploadPath.resolve(fileName);

        curriculo.transferTo(filePath);

        return UPLOAD_DIR + fileName;
    }
}
