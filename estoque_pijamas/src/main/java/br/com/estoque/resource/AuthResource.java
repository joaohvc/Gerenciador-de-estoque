package br.com.estoque.resource;

import br.com.estoque.DTO.GoogleLoginRequest;
import br.com.estoque.DTO.GoogleLoginResponse;
import br.com.estoque.service.GoogleTokenService;
import br.com.estoque.service.SessionService;
import br.com.estoque.service.UsuarioAcessoService;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

import jakarta.inject.Inject;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ServiceUnavailableException;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;
import java.util.Optional;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    private static final String SESSION_COOKIE = "JOLU_SESSION";

    @Inject
    GoogleTokenService googleTokenService;

    @Inject
    SessionService sessionService;

    @Inject
    UsuarioAcessoService usuarioAcessoService;

    @ConfigProperty(name = "app.session.cookie.secure", defaultValue = "false")
    boolean secureCookie;

    @POST
    @Path("/google")
    public Response loginGoogle(GoogleLoginRequest dados) {

        if (dados == null ||
                dados.credential == null ||
                dados.credential.isBlank()) {

            throw new WebApplicationException(
                    "O token do Google não foi informado!",
                    Response.Status.BAD_REQUEST
            );
        }

        try {
            GoogleIdToken.Payload payload =
                    googleTokenService.validarToken(dados.credential);

            if (payload == null ||
                    !Boolean.TRUE.equals(payload.getEmailVerified()) ||
                    payload.getEmail() == null ||
                    payload.getSubject() == null) {

                throw new WebApplicationException(
                        "Token inválido ou e-mail não verificado!",
                        Response.Status.UNAUTHORIZED
                );
            }

            GoogleLoginResponse resposta = usuarioAcessoService.autenticarGoogle(
                    payload.getEmail(),
                    payload.getSubject(),
                    (String) payload.get("name"),
                    (String) payload.get("picture")
            );

            SessionService.SessionCredentials sessao = sessionService.criar(resposta);
            return Response.ok(resposta)
                    .cookie(cookieSessao(sessao.id(), SessionService.SESSION_TTL_SECONDS))
                    .build();

        } catch (GeneralSecurityException | IOException e) {
            throw new ServiceUnavailableException(
                    "Não foi possível validar o token com o Google."
            );
        }
    }

    @GET
    @Path("/session")
    public Response verificarSessao(@CookieParam(SESSION_COOKIE) String sessionId) {
        Optional<Long> usuarioId = sessionService.buscarUsuarioId(sessionId);
        if (usuarioId.isEmpty()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("message", "Sessão inválida ou expirada."))
                    .build();
        }

        Optional<GoogleLoginResponse> usuario = usuarioAcessoService.buscarUsuarioAtivo(usuarioId.get());
        if (usuario.isEmpty()) {
            sessionService.invalidar(sessionId);
        } else {
            usuario.get().foto = sessionService.buscarFoto(sessionId).orElse(null);
        }
        return usuario
                .map(dados -> Response.ok(dados).build())
                .orElseGet(() -> Response.status(Response.Status.UNAUTHORIZED)
                        .entity(Map.of("message", "Sessão inválida ou expirada."))
                        .build());
    }

    @POST
    @Path("/logout")
    @Consumes(MediaType.WILDCARD)
    public Response logout(@CookieParam(SESSION_COOKIE) String sessionId) {
        sessionService.invalidar(sessionId);
        NewCookie cookieExpirado = cookieSessao("", 0);
        return Response.noContent().cookie(cookieExpirado).build();
    }

    private NewCookie cookieSessao(String value, int maxAge) {
        return new NewCookie.Builder(SESSION_COOKIE)
                .value(value)
                .path("/")
                .maxAge(maxAge)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite(NewCookie.SameSite.STRICT)
                .build();
    }
}