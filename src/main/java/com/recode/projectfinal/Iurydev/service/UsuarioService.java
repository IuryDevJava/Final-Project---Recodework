package com.recode.projectfinal.Iurydev.service;

import com.recode.projectfinal.Iurydev.dto.UsuarioDTO;
import com.recode.projectfinal.Iurydev.model.Usuario;
import com.recode.projectfinal.Iurydev.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario cadastrarUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.existsByEmail(usuarioDTO.email())) {
            throw new RuntimeException("E-mail já cadastrado");
        }

        if (usuarioRepository.existsByCpf(usuarioDTO.cpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }

        if (usuarioRepository.existsByCelular(usuarioDTO.celular())) {
            throw new RuntimeException("Celular já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(usuarioDTO.nome());
        usuario.setEmail(usuarioDTO.email());
        usuario.setCelular(usuarioDTO.celular());
        usuario.setCpf(usuarioDTO.cpf());
        usuario.setSenha(passwordEncoder.encode(usuarioDTO.senha()));

        return usuarioRepository.save(usuario);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenha())
                .roles("USER")
                .build();
    }

    public Usuario buscarUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }



}
