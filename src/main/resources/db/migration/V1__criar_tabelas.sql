CREATE TABLE tb_usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    celular VARCHAR(20) NOT NULL UNIQUE,
    cpf VARCHAR(20) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE vaga (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    empresa VARCHAR(255),
    localizacao VARCHAR(255),
    tipo_contrato VARCHAR(255),
    descricao TEXT,
    lgbtqia_friendly BOOLEAN,
    area VARCHAR(255)
);

CREATE TABLE candidatura (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vaga_id BIGINT,
    usuario_id BIGINT,
    nome_candidato VARCHAR(255),
    email_candidato VARCHAR(255),
    telefone_candidato VARCHAR(50),
    curriculo_path VARCHAR(255),
    mensagem TEXT,
    data_candidatura DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_candidatura_vaga FOREIGN KEY (vaga_id) REFERENCES vaga(id),
    CONSTRAINT fk_candidatura_usuario FOREIGN KEY (usuario_id) REFERENCES tb_usuarios(id)
);
