package com.recode.projectfinal.Iurydev.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "vaga")
@Getter
@Setter
public class Vaga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "empresa", nullable = false)
    private String empresa;

    @Column(name = "localizacao")
    private String localizacao;

    @Column(name = "tipo_contrato")
    private String tipoContrato;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "lgbtqia_friendly")
    private boolean lgbtqiaFriendly;

    @Column(name = "area")
    private String area;
}
