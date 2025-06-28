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

    private String nomeCandidato;
    private String emailCandidato;
    private String telefoneCandidato;
    private String curriculoPath;
    private String mensagem;

    @CreationTimestamp
    private LocalDateTime dataCandidatura;

}
