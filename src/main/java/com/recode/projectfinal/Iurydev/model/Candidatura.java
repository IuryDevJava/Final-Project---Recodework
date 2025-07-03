package com.recode.projectfinal.Iurydev.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidatura")
@Getter
@Setter
public class Candidatura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vaga_id")
    private Vaga vaga;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "nome_candidato")
    private String nomeCandidato;

    @Column(name = "email_candidato")
    private String emailCandidato;

    @Column(name = "telefone_candidato")
    private String telefoneCandidato;

    @Column(name = "curriculo_path", nullable = false)
    private String curriculoPath;

    @Column(name = "mensagem", columnDefinition = "TEXT")
    private String mensagem;

    @Column(name = "data_candidatura", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dataCandidatura;

}
