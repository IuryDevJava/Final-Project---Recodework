package com.recode.projectfinal.Iurydev.repository;

import com.recode.projectfinal.Iurydev.model.Vaga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VagaRepository extends JpaRepository<Vaga, Long> {
    List<Vaga> findByTituloContainingIgnoreCase(String termo);
    List<Vaga> findByAreaContainingIgnoreCase(String area);
}
