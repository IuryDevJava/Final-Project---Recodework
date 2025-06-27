package com.recode.projectfinal.Iurydev.dto;

import com.recode.projectfinal.Iurydev.model.Usuario;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String celular
) {
    // Construtor que converte Entidade para DTO
    public UsuarioResponseDTO(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getCelular()
        );
    }
}
