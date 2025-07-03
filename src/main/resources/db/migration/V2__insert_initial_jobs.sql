INSERT INTO
  vaga (
    titulo,
    empresa,
    localizacao,
    tipo_contrato,
    descricao,
    lgbtqia_friendly,
    area
  )
SELECT
  *
FROM
  (
    SELECT
      'Social Media' AS titulo,
      'Nomad' AS empresa,
      'São Paulo' AS localizacao,
      'Tempo integral' AS tipo_contrato,
      'Estamos buscando um Social Media criativo para gerenciar nossas redes sociais. Responsabilidades incluem criação de conteúdo, engajamento com a comunidade e análise de métricas.' AS descricao,
      1 AS lgbtqia_friendly,
      'Design' AS area
    UNION ALL
    SELECT
      'Social Media Assistant',
      'Netlify',
      'São Paulo',
      'Tempo integral',
      'Assistente de Social Media para apoiar na criação de conteúdo e gestão de comunidades online.',
      1,
      'Design'
    UNION ALL
    SELECT
      'Desenvolvedor Full Stack',
      'Dropbox',
      'Rio de Janeiro',
      'Tempo integral',
      'Desenvolvedor Full Stack para trabalhar em nossas aplicações web. Requisitos: experiência com React, Node.js, bancos de dados relacionais.',
      1,
      'Full Stack'
    UNION ALL
    SELECT
      'Brand Designer',
      'Maze',
      'San Francisco, USA',
      'Tempo integral',
      'Designer de marca para criar identidades visuais impactantes. Procuramos alguém com portfólio forte em design de marca.',
      1,
      'Design'
    UNION ALL
    SELECT
      'Interactive Developer',
      'Oracle',
      'São Paulo',
      'Tempo integral',
      'Desenvolvedor Interativo para criar experiências digitais inovadoras. Requisitos: conhecimento em JavaScript, CSS animations.',
      1,
      'Front-End'
    UNION ALL
    SELECT
      'Social Media',
      'Udacity',
      'Hamburg, Germany',
      'Tempo integral',
      'Estamos buscando um Social Media criativo para gerenciar nossas redes sociais. Responsabilidades incluem criação de conteúdo, engajamento com a comunidade e análise de métricas. Requisitos: experiência com redes sociais, conhecimento em design básico e excelente comunicação.',
      1,
      'Design'
    UNION ALL
    SELECT
      'Back-End Developer',
      'Google',
      'Belo Horizonte, MG',
      'Tempo integral',
      'Desenvolvedor Back-End para trabalhar em sistemas escaláveis. Requisitos: experiência com Java, Spring Boot, microsserviços.',
      1,
      'Back-End'
    UNION ALL
    SELECT
      'DevOps Engineer',
      'Microsoft',
      'Redmond, USA',
      'Tempo integral',
      'Engenheiro DevOps para implementar e manter pipelines de CI/CD. Requisitos: conhecimento em Docker, Kubernetes, Azure.',
      1,
      'DevOps'
    UNION ALL
    SELECT
      'Data Scientist',
      'IBM',
      'Campinas, SP',
      'Tempo integral',
      'Cientista de Dados para desenvolver modelos preditivos e análises avançadas. Requisitos: experiência com Python, machine learning.',
      1,
      'Data Science'
    UNION ALL
    SELECT
      'QA Tester',
      'GitHub',
      'Remoto',
      'Freelancer',
      'Testador de Qualidade para garantir a qualidade dos nossos produtos. Requisitos: experiência com testes manuais e automatizados.',
      1,
      'Qualidade'
    UNION ALL
    SELECT
      'Machine Learning Engineer',
      'NVIDIA',
      'Austin, USA',
      'Tempo integral',
      'Engenheiro de Machine Learning para desenvolver modelos de IA. Requisitos: experiência com TensorFlow, PyTorch.',
      1,
      'IA/ML'
    UNION ALL
    SELECT
      'Cyber Security Analyst',
      'Palo Alto Networks',
      'Remoto',
      'Tempo integral',
      'Analista de Segurança para proteger nossos sistemas contra ameaças. Requisitos: conhecimento em firewalls, SIEM.',
      1,
      'Segurança'
    UNION ALL
    SELECT
      'Product Manager',
      'Atlassian',
      'São Paulo',
      'Tempo integral',
      'Gerente de Produto para liderar o desenvolvimento de novas funcionalidades. Responsável por definir roadmap.',
      1,
      'Produto'
  ) AS novas_vagas
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      vaga
    WHERE
      titulo = novas_vagas.titulo
      AND empresa = novas_vagas.empresa
      AND localizacao = novas_vagas.localizacao
  );