package br.com.estoque.service;

import br.com.estoque.DTO.GoogleLoginResponse;
import jakarta.enterprise.context.ApplicationScoped;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class SessionService {

    public static final int SESSION_TTL_SECONDS = 8 * 60 * 60;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, Session> sessions = new ConcurrentHashMap<>();

    public SessionCredentials criar(GoogleLoginResponse usuario) {
        if (usuario.usuarioId == null) {
            throw new IllegalArgumentException("A sessão requer um usuário autorizado do banco.");
        }
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String id = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        sessions.put(id, new Session(
                usuario.usuarioId,
                usuario.foto,
                Instant.now().plusSeconds(SESSION_TTL_SECONDS)
        ));
        return new SessionCredentials(id, usuario);
    }

    public Optional<Long> buscarUsuarioId(String id) {
        if (id == null || id.isBlank()) {
            return Optional.empty();
        }

        Session sessao = sessions.get(id);
        if (sessao == null) {
            return Optional.empty();
        }
        if (!sessao.expiraEm().isAfter(Instant.now())) {
            sessions.remove(id, sessao);
            return Optional.empty();
        }
        return Optional.of(sessao.usuarioId());
    }

    public Optional<String> buscarFoto(String id) {
        if (id == null || id.isBlank()) {
            return Optional.empty();
        }
        Session sessao = sessions.get(id);
        return sessao == null ? Optional.empty() : Optional.ofNullable(sessao.foto());
    }

    public void invalidar(String id) {
        if (id != null) {
            sessions.remove(id);
        }
    }

    public record SessionCredentials(String id, GoogleLoginResponse usuario) { }

    private record Session(Long usuarioId, String foto, Instant expiraEm) { }
}
