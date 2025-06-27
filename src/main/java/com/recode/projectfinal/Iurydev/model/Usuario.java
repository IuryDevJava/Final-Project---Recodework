package com.recode.projectfinal.Iurydev.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.br.CPF;

@Data
@Entity
@Table(name = "tb_usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O Atributo Nome é Obrigatório!")
    private String nome;

    @Email(message = "E-mail inválido")
    @NotBlank(message = "E-mail é obrigatório")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Celular é obrigatório")
    @Column(nullable = false, unique = true)
    @Pattern(regexp = "^\\+?[0-9]{10,15}$",
            message = "Número de celular inválido")
    private String celular;

    @NotBlank(message = "CPF é obrigatório")
    @Column(nullable = false, unique = true)
    @CPF(message = "CPF inválido")
    private String cpf;

    @NotBlank(message = "O Atributo Senha é Obrigatório!")
    @Size(min = 8, message = "A Senha deve ter no mínimo 8 caracteres")
    @Column(nullable = false)
    private String senha;
}
