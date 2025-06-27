package com.recode.projectfinal.Iurydev.controller;

import com.recode.projectfinal.Iurydev.dto.UsuarioDTO;

import com.recode.projectfinal.Iurydev.model.Usuario;
import com.recode.projectfinal.Iurydev.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/")
    public String mostrarIndex() {
        return "index"; // index.html está na raiz de templates
    }

    @GetMapping("/home")
    public String mostrarIndexAlternativo() {
        return "index"; // Mesma página que "/"
    }

    @GetMapping("/cadastro")
    public String mostrarPaginaCadastro(Model model) {
        model.addAttribute("usuarioDTO", UsuarioDTO.createEmpty());
        return "pages/cadastro"; // caminho completo para a subpasta
    }

    @PostMapping("/cadastro")
    public String processarCadastro(
            @Valid @ModelAttribute("usuarioDTO") UsuarioDTO usuarioDTO,
            BindingResult bindingResult,
            Model model) {

        if (bindingResult.hasErrors()) {
            return "pages/cadastro"; // mantém o mesmo caminho para validação
        }

        try {
            usuarioService.cadastrarUsuario(usuarioDTO);
            return "redirect:/entrar?sucesso"; // redirecionamento absoluto
        } catch (RuntimeException e) {
            model.addAttribute("erro", e.getMessage());
            return "pages/cadastro";
        }
    }

    @GetMapping("/entrar")
    public String mostrarPaginaLogin(
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "logout", required = false) String logout,
            @RequestParam(value = "sucesso", required = false) String sucesso,
            Model model) {

        if (error != null) {
            model.addAttribute("erro", "E-mail ou senha inválidos");
        }
        if (logout != null) {
            model.addAttribute("sucesso", "Você foi desconectado com sucesso");
        }
        if (sucesso != null) {
            model.addAttribute("sucesso", "Cadastro realizado com sucesso! Faça login para continuar.");
        }

        return "pages/entrar";
    }

    @GetMapping("/home-logada")
    public String mostrarHomeLogada(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Usuario usuario = usuarioService.buscarUsuarioPorEmail(email);
        model.addAttribute("nomeUsuario", usuario.getNome());

        return "pages/home-logada";
    }

}