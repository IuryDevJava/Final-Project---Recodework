# Recodework - Plataforma LGBTQIA+ para Vagas, Cursos e Apoio Psicológico  

[![Licença](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Status](https://img.shields.io/badge/status-em%20produção-brightgreen)](https://github.com/IuryDevJava/Final-Project---Recodework)  
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.org/)  
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen.svg)](https://spring.io/)  

**Plataforma exclusiva para a comunidade LGBTQIA+**, integrando:  
✅ **Vagas de emprego inclusivas**  
✅ **Cursos gratuitos de capacitação**  
✅ **Apoio psicológico seguro e acolhedor**  

---

## 🌟 Destaques  
- **Foco em diversidade**: Ambiente projetado para as necessidades da comunidade LGBTQIA+.  
- **Tudo em um lugar**: Combina oportunidades profissionais, educação e saúde mental.  
- **Totalmente gratuito**: Sem custos para usuários ou parceiros.  

---

## 🛠️ Tecnologias  

| Categoria       | Ferramentas/Frameworks                                                                 |
|-----------------|---------------------------------------------------------------------------------------|
| **Front-end**   | HTML5, CSS3, JavaScript, Bootstrap 5                                                  |
| **Back-end**    | Java 17, Spring Boot 3.5.3, Maven, MySQL 8                                            |
| **Design**      | Figma (prototipagem)                                                                  |
| **Infra**       | Docker, Render (deploy), Railway (DB)                                                 |
| **Ferramentas** | IntelliJ IDEA, VS Code, Git, OpenAPI (documentação)                                   |

---

## 🚀 Começando  

### 📋 Pré-requisitos  
- Java JDK 17  
- Docker e Docker Compose  
- MySQL 8.0+  
- Conta na [OpenAI](https://platform.openai.com/) (para integração com IA)  

---

### 🔌 Instalação Local  

1. **Clone o repositório**:  
   ```bash
   git clone https://github.com/IuryDevJava/Final-Project---Recodework
   cd Final-Project---Recodework

1.2 **Estrutura de pastas do projeto**:
   ```
   📦Iurydev
 ┣ 📂.mvn
 ┣ 📂src
 ┃ ┣ 📂main
 ┃ ┃ ┣ 📂java
 ┃ ┃ ┃ ┗ 📂com
 ┃ ┃ ┃ ┃ ┗ 📂recode
 ┃ ┃ ┃ ┃ ┃ ┗ 📂projectfinal
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂Iurydev
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂config         # Configurações da aplicação
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller     # Controladores REST
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto            # Data Transfer Objects
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂model          # Entidades do domínio
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository     # Acesso a dados
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service        # Lógica de negócios
 ┃ ┃ ┣ 📂resources
 ┃ ┃ ┃ ┣ 📜application.properties
 ┃ ┃ ┃ ┣ 📜application-dev.properties
 ┃ ┃ ┃ ┣ 📜application-docker.properties
 ┃ ┃ ┃ ┣ 📜application-prod.properties
 ┃ ┃ ┃ ┣ 📂static               # Arquivos estáticos (CSS, JS, imagens)
 ┃ ┃ ┃ ┗ 📂templates            # Templates Thymeleaf
 ┃ ┣ 📂test
 ┃ ┃ ┗ 📂java                   # Testes automatizados
 ┣ 📜.gitignore
 ┣ 📜Dockerfile                 # Docker build da aplicação
 ┣ 📜docker-compose.yml         # Orquestração de contêineres
 ┣ 📜mvnw
 ┣ 📜mvnw.cmd
 ┣ 📜pom.xml                    # Dependências e build do Maven

   ```


2. **Gere a chave key**:
   ```
   https://platform.openai.com/settings/organization/api-keys
   ```
   clique em + Create new secret key
   Copie a sua chave e guarde em um local seguro.
   Observações: não compartilhe a sua chave.

   No Intellij vá em Run / Debug Configurations -> Edit Configurations... -> Modify options -> Environment variables
   após isso vai aparecer um campo com Environment variables -> Edit -> +
   e crie sua variável de ambiente com Name: ```openai.api.key```  Value: ```sk-suachaveaqui...```


3. **Vá em resources e crie um arquivo application-docker.properties adicione**:
    ``` 
    spring.datasource.url=jdbc:mysql://db:3306/namedb?useSSL=false&serverTimezone=America/Sao_Paulo&allowPublicKeyRetrieval=true
    spring.datasource.username=seuusuario
    spring.datasource.password=suasenha
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
    spring.jpa.show-sql=true
    
    spring.sql.init.mode=never
    spring.flyway.locations=classpath:db/migration
    spring.flyway.baseline-on-migrate=true
    spring.flyway.enabled=true
    
    spring.thymeleaf.prefix=classpath:/templates/
    spring.thymeleaf.suffix=.html
    spring.thymeleaf.check-template-location=true
    
    spring.servlet.multipart.max-file-size=5MB
    spring.servlet.multipart.max-request-size=5MB
    
    openai.api.key=${openai.api.key}
    openai.api.url=https://api.openai.com/v1/chat/completions
    openai.api.model=gpt-3.5-turbo
    openai.api.temperature=0.7
    openai.api.max-tokens=500
    
    spring.mvc.async.request-timeout=60000
    
    spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
    spring.jackson.time-zone=America/Sao_Paulo
    ```

4. **Procure application.properties e adicione**:
   ```
   #Isso vai chamar o application-docker.properties
   spring.profiles.active=docker
   ```


5. **Na raiz do projeto e crie o arquivo docker-compose.yml e adicione**:
   ```
   version: '3.8'
    services:
      db:
        image: mysql:8.0
        container_name: name_db
        volumes:
          - mysql_data:/var/lib/mysql
        ports:
          - "3307:3306"
        environment:
          MYSQL_ROOT_PASSWORD: suasenhaaqui
          MYSQL_DATABASE: namedb
          MYSQL_USER: seuusuario
          MYSQL_PASSWORD: suasenha
        healthcheck:
          test: [ "CMD", "mysqladmin", "ping", "-h", "localhost" ]
          interval: 10s
          timeout: 5s
          retries: 5
    
      app:
        build: 
        container_name: recodework_app
        depends_on:
          db:
            condition: service_healthy
        ports:
          - "8080:8080"
        environment:
          SPRING_PROFILES_ACTIVE: docker
    
    volumes:
      mysql_data:
      ```


6. **Na raiz do projeto crie um arquivo Dockerfile e adicione**:
   ```
   FROM maven:3.9.6-eclipse-temurin-17 AS build
   WORKDIR /app
  
   COPY pom.xml .
   COPY src ./src
  
   RUN mvn clean package -DskipTests
  
   FROM openjdk:17-jdk-slim
   WORKDIR /app
  
   COPY --from=build /app/target/*.jar app.jar
  
   EXPOSE 8080
  
   ENTRYPOINT ["java", "-jar", "app.jar"]
   ```


7. **Aperte ALT+F12 ou abra o terminal(caminho inicial do projeto - raiz) e digite os comandos abaixo para deixar sua aplicação dockerizada**:
   ```
   mvn clean
   mvn clean package -DskipTests
   docker-compose up --build
   ```

---

##  Ambiente de desenvolvimento   

###  Banco de dados MySQL

1. **Crie o banco de dados**:
   ```
   CREATE DATABASE namedb;
   USE namedb;
   ```


2. **Crie as vagas**:

   ```
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
   VALUES
     (
       'Social Media',
       'Nomad',
       'São Paulo',
       'Tempo integral',
       'Estamos buscando um Social Media criativo para gerenciar nossas redes sociais. Responsabilidades incluem criação de conteúdo, engajamento com a comunidade e análise de métricas. Requisitos: experiência com redes sociais, conhecimento em design básico e excelente comunicação.',
       TRUE,
       'Design'
     ),
     (
       'Social Media Assistant',
       'Netlify',
       'São Paulo',
       'Tempo integral',
       'Assistente de Social Media para apoiar na criação de conteúdo e gestão de comunidades online. Ideal para quem está começando na área e quer aprender com uma equipe experiente.',
       TRUE,
       'Design'
     ),
     (
       'Desenvolvedor Full Stack',
       'Dropbox',
       'Rio de Janeiro',
       'Tempo integral',
       'Desenvolvedor Full Stack para trabalhar em nossas aplicações web. Requisitos: experiência com React, Node.js, bancos de dados relacionais e conhecimento em arquitetura de software.',
       TRUE,
       'Full Stack'
     ),
     (
       'Brand Designer',
       'Maze',
       'San Francisco, USA',
       'Tempo integral',
       'Designer de marca para criar identidades visuais impactantes. Procuramos alguém com portfólio forte em design de marca e experiência em trabalhar com equipes internacionais.',
       TRUE,
       'Design'
     ),
     (
       'Interactive Developer',
       'Oracle',
       'São Paulo',
       'Tempo integral',
       'Desenvolvedor Interativo para criar experiências digitais inovadoras. Requisitos: conhecimento em JavaScript, CSS animations e frameworks modernos.',
       TRUE,
       'Front-End'
     ),
     (
       'Social Media',
       'Udacity',
       'Hamburg, Germany',
       'Tempo integral',
       'Estamos buscando um Social Media criativo para gerenciar nossas redes sociais. Responsabilidades incluem criação de conteúdo, engajamento com a comunidade e análise de métricas. Requisitos: experiência com redes sociais, conhecimento em design básico e excelente comunicação.',
       TRUE,
       'Design'
     ),
     (
       'Back-End Developer',
       'Google',
       'Belo Horizonte, MG',
       'Tempo integral',
       'Desenvolvedor Back-End para trabalhar em sistemas escaláveis. Requisitos: experiência com Java, Spring Boot, microsserviços e cloud computing.',
       TRUE,
       'Back-End'
     ),
     (
       'DevOps Engineer',
       'Microsoft',
       'Redmond, USA',
       'Tempo integral',
       'Engenheiro DevOps para implementar e manter pipelines de CI/CD. Requisitos: conhecimento em Docker, Kubernetes, Azure e infraestrutura como código.',
       TRUE,
       'DevOps'
     ),
     (
       'Data Scientist',
       'IBM',
       'Campinas, SP',
       'Tempo integral',
       'Cientista de Dados para desenvolver modelos preditivos e análises avançadas. Requisitos: experiência com Python, machine learning e big data.',
       TRUE,
       'Data Science'
     ),
     (
       'QA Tester',
       'GitHub',
       'Remoto',
       'Freelancer',
       'Testador de Qualidade para garantir a qualidade dos nossos produtos. Requisitos: experiência com testes manuais e automatizados, conhecimento em Selenium.',
       TRUE,
       'Qualidade'
     ),
     (
       'Machine Learning Engineer',
       'NVIDIA',
       'Austin, USA',
       'Tempo integral',
       'Engenheiro de Machine Learning para desenvolver modelos de IA. Requisitos: experiência com TensorFlow, PyTorch e processamento de grandes volumes de dados.',
       TRUE,
       'IA/ML'
     ),
     (
       'Cyber Security Analyst',
       'Palo Alto Networks',
       'Remoto',
       'Tempo integral',
       'Analista de Segurança para proteger nossos sistemas contra ameaças. Requisitos: conhecimento em firewalls, SIEM e técnicas de hacking ético.',
       TRUE,
       'Segurança'
     ),
     (
       'Product Manager',
       'Atlassian',
       'São Paulo',
       'Tempo integral',
       'Gerente de Produto para liderar o desenvolvimento de novas funcionalidades. Responsável por definir roadmap, priorizar features e trabalhar com equipes multidisciplinares.',
       TRUE,
       'Produto'
     );
   ```


3. **Veja as vagas:**
   ```
   SELECT * FROM vagas;
   ```
      
    
4. **Em resources crie um arquivo application-dev.properties e adicione**:  
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/namedb?useSSL=false&serverTimezone=America/Sao_Paulo
   spring.datasource.username=seuusuario
   spring.datasource.password=suasenha
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.format_sql=true
    
   spring.sql.init.mode=never
   spring.flyway.locations=classpath:db/migration
   spring.flyway.baseline-on-migrate=true
   spring.flyway.enabled=true
    
   spring.datasource.hikari.connection-timeout=20000
   spring.datasource.hikari.maximum-pool-size=5
    
   spring.thymeleaf.prefix=classpath:/templates/
   spring.thymeleaf.suffix=.html
   spring.thymeleaf.check-template-location=true
    
   spring.servlet.multipart.max-file-size=5MB
   spring.servlet.multipart.max-request-size=5MB
    
   openai.api.key=${openai.api.key}
   openai.api.url=https://api.openai.com/v1/chat/completions
   openai.api.model=gpt-3.5-turbo
   openai.api.temperature=0.7
   openai.api.max-tokens=500
    
   spring.mvc.async.request-timeout=60000
    
   spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
   spring.jackson.time-zone=America/Sao_Paulo
   ```


5. **Em seguida, no application.properties, mude para**:
   ```
   spring.profiles.active=dev
   ```


6. **Pode rodar o projeto normalmente e acesse**:
   ```
   localhost:8080/home
   ```
   
---

# 🚀 Deploy e Configuração da Aplicação

[![Deploy](https://img.shields.io/badge/deploy-production-2ea44f?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

---

## ⚙️ Exemplo do `application-prod.properties`

Arquivo completo localizado em: `src/main/resources/application-prod.properties`

```properties
spring.datasource.url=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
spring.datasource.username=${MYSQLUSER}
spring.datasource.password=${MYSQLPASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.hbm2ddl.auto=update

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.sql.init.mode=always
spring.sql.init.continue-on-error=true
spring.jpa.defer-datasource-initialization=true
spring.jpa.properties.hibernate.hbm2ddl.create-constraints=true

spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.check-template-location=true

spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB

openai.api.key=${openai.api.key}
openai.api.url=https://api.openai.com/v1/chat/completions
openai.api.model=gpt-3.5-turbo
openai.api.temperature=0.7
openai.api.max-tokens=500

spring.mvc.async.request-timeout=60000

spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
spring.jackson.time-zone=America/Sao_Paulo

spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.maximum-pool-size=5

logging.level.root=INFO
logging.level.org.springframework.web=INFO
logging.level.com.yourpackage=DEBUG


## 🔁 Atualize o `application.properties`

Para ativar o modo produção, configure:

```properties
spring.profiles.active=prod


🌐 Conectando com Railway e Render
🌐 2. Configure o Banco de Dados no Railway
Acesse Railway.

Crie um novo projeto e selecione o banco MySQL.

Copie as variáveis de ambiente geradas (host, usuário, senha, etc).

🚀 3. Faça o Deploy da Aplicação no Render
Acesse Render.

Crie um novo Web Service.

Conecte seu repositório GitHub.

Adicione as seguintes variáveis de ambiente no Render(Environment):

| Variável         | Valor                        |
| ---------------- | ---------------------------- |
| `MYSQLDATABASE`  | railway                      |
| `MYSQLHOST`      | mainline.proxy.rlwy.net      |
| `MYSQLPORT`      | 21465                        |
| `MYSQLUSER`      | root                         |
| `MYSQLPASSWORD`  | \*\*\*\*\*\*\*\*\*\*\*\*\*\* |
| `openai.api.key` | sk-... (sua chave da OpenAI) |

