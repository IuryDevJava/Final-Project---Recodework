package com.recode.projectfinal.Iurydev.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/home", "/cadastro", "/entrar", "/assets/**").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/entrar")
                        .loginProcessingUrl("/entrar")  // URL que processa o login
                        .usernameParameter("email")     // Campo do formulário
                        .passwordParameter("senha")     // Campo do formulário
                        .defaultSuccessUrl("/home-logada", true)
                        .failureUrl("/entrar?error=true")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/home")  // Redireciona para a página inicial
                        .invalidateHttpSession(true)  // Opcional: invalida a sessão
                        .deleteCookies("JSESSIONID")  // Opcional: remove cookies
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
