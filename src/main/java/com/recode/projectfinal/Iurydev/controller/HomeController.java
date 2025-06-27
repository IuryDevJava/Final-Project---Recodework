package com.recode.projectfinal.Iurydev.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "index"; // index.html em templates/
    }
    @GetMapping("/cadastro")
    public String cadastro() {
        return "pages/cadastro"; // cadastro.html em templates/
    }
    @GetMapping("/entrar")
    public String entrar() {
        return "pages/entrar"; // entrar.html em templates/
    }
}
