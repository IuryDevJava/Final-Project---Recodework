ALTER TABLE vaga
  ADD CONSTRAINT vaga_unica UNIQUE (titulo, empresa, localizacao);