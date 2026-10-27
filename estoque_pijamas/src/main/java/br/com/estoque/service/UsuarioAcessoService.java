package br.com.estoque.service;

import br.com.estoque.DTO.GoogleLoginResponse;
import br.com.estoque.model.UsuarioAcesso;
import br.com.estoque.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;

import java.util.Locale;
import java.util.Optional;

@ApplicationScoped
public class UsuarioAcessoService {

    @Inject
    UsuarioRepository usuarioRepository;

    @Transactional
    public GoogleLoginResponse autenticarGoogle(String emailVerificado, String googleSub, String nome, String foto) {
        String email = normalizarEmail(emailVerificado);
        if (googleSub == null || googleSub.isBlank()) {
            throw new ForbiddenException("A identidade Google não possui um identificador válido.");
        }

        UsuarioAcesso usuario = usuarioRepository.buscarPorEmailParaAtualizacao(email);
        if (usuario == null || !usuario.ativo) {
            throw new ForbiddenException("Este usuário não está autorizado a acessar o sistema.");
        }

        if (!perfilValido(usuario.perfil)) {
            throw new ForbiddenException("O perfil deste usuário não está autorizado.");
        }

        if (usuario.googleSub == null || usuario.googleSub.isBlank()) {
            UsuarioAcesso usuarioComSub = usuarioRepository.buscarPorGoogleSub(googleSub);
            if (usuarioComSub != null && !usuarioComSub.id.equals(usuario.id)) {
                throw new ForbiddenException("Esta identidade Google já está vinculada a outra conta.");
            }
            usuario.googleSub = googleSub;
        } else if (!usuario.googleSub.equals(googleSub)) {
            throw new ForbiddenException("A identidade Google não corresponde à conta autorizada.");
        }

        if (usuario.nome == null || usuario.nome.isBlank()) {
            usuario.nome = nome;
        }
        return resposta(usuario, foto);
    }

    @Transactional
    public Optional<GoogleLoginResponse> buscarUsuarioAtivo(Long usuarioId) {
        UsuarioAcesso usuario = usuarioRepository.findById(usuarioId);
        if (usuario == null || !usuario.ativo || !perfilValido(usuario.perfil)) {
            return Optional.empty();
        }
        return Optional.of(resposta(usuario, null));
    }

    private String normalizarEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ForbiddenException("A conta Google não possui um e-mail válido.");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private boolean perfilValido(String perfil) {
        return "ADMIN".equalsIgnoreCase(perfil) || "CONSULTA".equalsIgnoreCase(perfil);
    }

    private GoogleLoginResponse resposta(UsuarioAcesso usuario, String foto) {
        return new GoogleLoginResponse(
                usuario.id,
                usuario.googleSub,
                usuario.email,
                usuario.nome,
                foto,
                usuario.perfil.toUpperCase(Locale.ROOT)
        );
    }
}
