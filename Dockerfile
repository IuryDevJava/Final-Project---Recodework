#FROM ubuntu:latest AS build

#RUN apt-get update
#RUN apt-get install openjdk-17-jdk -y
#COPY . .

#RUN apt-get install maven -y
#RUN mvn clean install

#FROM openjdk:17-jdk-slim

#EXPOSE 8080

#COPY --from=build /target/Iurydev.jar app.jar

#ENTRYPOINT ["java", "-jar", "app.jar"]



# Etapa 1: Compilar o projeto
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod


ENTRYPOINT ["java", "-jar", "app.jar"]
