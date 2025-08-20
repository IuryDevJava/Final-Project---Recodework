package com.recode.projectfinal.Iurydev.service;

import com.recode.projectfinal.Iurydev.dto.UsuarioDTO;
import com.recode.projectfinal.Iurydev.model.Usuario;
import com.recode.projectfinal.Iurydev.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario cadastrarUsuario(UsuarioDTO usuarioDTO) {
        log.info("UsuarioService: inicializando o método cadastrarUsuario() - usuarioDTO = {}", usuarioDTO);
        if (usuarioRepository.existsByEmail(usuarioDTO.email())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        if (usuarioRepository.existsByCpf(usuarioDTO.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        if (usuarioRepository.existsByCelular(usuarioDTO.celular())) {
            throw new IllegalArgumentException("Celular já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(usuarioDTO.nome());
        usuario.setEmail(usuarioDTO.email());
        usuario.setCelular(usuarioDTO.celular());
        usuario.setCpf(usuarioDTO.cpf());
        usuario.setSenha(passwordEncoder.encode(usuarioDTO.senha()));

        log.info("UsuarioService: finalizando o método cadastrarUsuario() - usuario = {}", usuario);
        return usuarioRepository.save(usuario);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("UsuarioService : Iniciando o método loadUserByUsername() - email = {}", email);
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        log.info("UsuarioService : Finalizando o método loadUserByUsername() - usuario = {}", usuario);
        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenha())
                .roles("USER")
                .build();
    }

    public Usuario buscarUsuarioPorEmail(String email) {
        log.info("UsuarioService : Iniciando o método buscarUsuarioPorEmail() - email = {}", email);
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }

}
