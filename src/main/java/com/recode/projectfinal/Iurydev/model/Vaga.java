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

    private String titulo;
    private String empresa;
    private String localizacao;
    private String tipoContrato;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private boolean lgbtqiaFriendly;
    private String area;
}
