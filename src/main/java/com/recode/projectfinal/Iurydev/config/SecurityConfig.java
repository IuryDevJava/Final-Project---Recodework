package com.recode.projectfinal.Iurydev.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configuração CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Desabilitar CSRF para endpoints WebSocket
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/ws-chat/**")
                )

                // Configuração de sessão
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                )

                // Autorizações
                .authorizeHttpRequests(auth -> auth
                        // Permite acesso público
                        .requestMatchers(
                                "/", "/home", "/cadastro", "/entrar",
                                "/assets/**", "/vagas/**", "/ws-chat/**"
                        ).permitAll()

                        // Todas outras requisições exigem autenticação
                        .anyRequest().authenticated()
                )

                // Configuração do formulário de login
                .formLogin(form -> form
                        .loginPage("/entrar")
                        .loginProcessingUrl("/entrar")
                        .usernameParameter("email")
                        .passwordParameter("senha")
                        .defaultSuccessUrl("/home/user", true)
                        .failureUrl("/entrar?error=true")
                        .permitAll()
                )

                // Configuração de logout
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/home")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}