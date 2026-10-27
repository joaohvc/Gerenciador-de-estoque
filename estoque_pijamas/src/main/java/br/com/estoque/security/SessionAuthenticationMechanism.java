package br.com.estoque.security;

import br.com.estoque.DTO.GoogleLoginResponse;
import br.com.estoque.service.SessionService;
import br.com.estoque.service.UsuarioAcessoService;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.identity.IdentityProviderManager;
import io.quarkus.security.identity.request.AuthenticationRequest;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;
import io.quarkus.vertx.http.runtime.security.ChallengeData;
import io.quarkus.vertx.http.runtime.security.HttpAuthenticationMechanism;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.infrastructure.Infrastructure;
import io.vertx.core.http.Cookie;
import io.vertx.ext.web.RoutingContext;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;

import java.security.Principal;
import java.util.Optional;
import java.util.Set;

@ApplicationScoped
public class SessionAuthenticationMechanism implements HttpAuthenticationMechanism {

    private static final String SESSION_COOKIE = "JOLU_SESSION";

    @Inject
    SessionService sessionService;

    @Inject
    UsuarioAcessoService usuarioAcessoService;

    @Override
    public Uni<SecurityIdentity> authenticate(
            RoutingContext context,
            IdentityProviderManager identityProviderManager) {
        Cookie cookie = context.request().getCookie(SESSION_COOKIE);
        if (cookie == null) {
            return Uni.createFrom().nullItem();
        }

        return Uni.createFrom().deferred(() -> {
            Optional<Long> usuarioId = sessionService.buscarUsuarioId(cookie.getValue());
            if (usuarioId.isEmpty()) {
                return Uni.createFrom().<SecurityIdentity>nullItem();
            }

            Optional<GoogleLoginResponse> usuario =
                    usuarioAcessoService.buscarUsuarioAtivo(usuarioId.get());
            if (usuario.isEmpty()) {
                sessionService.invalidar(cookie.getValue());
                return Uni.createFrom().<SecurityIdentity>nullItem();
            }
            return Uni.createFrom().item(new SessionIdentity(usuario.get()).comoIdentidade());
        }).runSubscriptionOn(Infrastructure.getDefaultWorkerPool());
    }

    @Override
    public Uni<ChallengeData> getChallenge(RoutingContext context) {
        return Uni.createFrom().item(
                new ChallengeData(401, HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
        );
    }

    @Override
    public Set<Class<? extends AuthenticationRequest>> getCredentialTypes() {
        return Set.of();
    }

    private record SessionIdentity(GoogleLoginResponse usuario) {

        SecurityIdentity comoIdentidade() {
            String nome = usuario.nome == null || usuario.nome.isBlank()
                    ? usuario.email
                    : usuario.nome;
            Principal principal = () -> nome;
            return QuarkusSecurityIdentity.builder()
                    .setPrincipal(principal)
                    .addRole(usuario.perfil)
                    .addAttribute(SecurityIdentity.USER_ATTRIBUTE, usuario)
                    .build();
        }
    }
}
