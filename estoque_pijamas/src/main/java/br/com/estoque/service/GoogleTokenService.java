package br.com.estoque.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@ApplicationScoped
public class GoogleTokenService {

    @ConfigProperty(name = "google.oauth.client-id")
    String clientId;

    private GoogleIdTokenVerifier verifier;

    @PostConstruct
    void inicializar() {
        verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance()
        )
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    public GoogleIdToken.Payload validarToken(String token)
            throws GeneralSecurityException, IOException {

        try {
            GoogleIdToken idToken = verifier.verify(token);

            if (idToken == null) {
                return null;
            }

            return idToken.getPayload();

        } catch (IllegalArgumentException e) {
            // Token malformado ou em formato inválido.
            return null;
        }
    }
}
