package br.com.estoque;

import br.com.estoque.DTO.GoogleLoginResponse;
import br.com.estoque.service.SessionService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SessionServiceTest {

    @Test
    void criaSessaoAleatoriaQuePodeSerVerificadaEInvalidada() {
        SessionService sessionService = new SessionService();
        GoogleLoginResponse user = new GoogleLoginResponse(
                1L,
                "google-id",
                "julia@example.com",
                "Julia",
                null,
                "ADMIN"
        );

        SessionService.SessionCredentials first = sessionService.criar(user);
        SessionService.SessionCredentials second = sessionService.criar(user);

        assertNotEquals(first.id(), second.id());
        assertEquals(43, first.id().length());
        assertEquals(1L, sessionService.buscarUsuarioId(first.id()).orElseThrow());
        assertTrue(sessionService.buscarUsuarioId("not-a-session").isEmpty());

        sessionService.invalidar(first.id());

        assertFalse(sessionService.buscarUsuarioId(first.id()).isPresent());
        assertTrue(sessionService.buscarUsuarioId(second.id()).isPresent());
    }
}
