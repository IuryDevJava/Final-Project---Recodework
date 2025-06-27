package com.recode.projectfinal.Iurydev.controller;

import com.recode.projectfinal.Iurydev.dto.UsuarioDTO;
import com.recode.projectfinal.Iurydev.model.Usuario;
import com.recode.projectfinal.Iurydev.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@RequestMapping("/api/usuarios")
public class UsuarioController {



    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        if (repository.existsByEmail(usuarioDTO.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");  // 409 é mais apropriado
        }

        if (repository.existsByCpf(usuarioDTO.cpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
        }

        if (repository.existsByCelular(usuarioDTO.celular())) {  // Adicionado verificação de celular
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Celular já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(usuarioDTO.nome());
        usuario.setEmail(usuarioDTO.email());
        usuario.setCpf(usuarioDTO.cpf());
        usuario.setCelular(usuarioDTO.celular());
        usuario.setSenha(passwordEncoder.encode(usuarioDTO.senha()));

        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(usuario));
    }
}