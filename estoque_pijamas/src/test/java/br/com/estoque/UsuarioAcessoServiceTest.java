package br.com.estoque;

import br.com.estoque.model.UsuarioAcesso;
import br.com.estoque.repository.UsuarioRepository;
import br.com.estoque.service.UsuarioAcessoService;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.ForbiddenException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

@QuarkusTest
class UsuarioAcessoServiceTest {

    @Inject
    UsuarioAcessoService usuarioAcessoService;

    @InjectMock
    UsuarioRepository usuarioRepository;

    @BeforeEach
    void limparMocks() {
        reset(usuarioRepository);
    }

    @Test
    void vinculaSubVerificadoAoUsuarioCadastradoEAtivo() {
        UsuarioAcesso usuario = usuario(10L, null, "ADMIN", true);
        when(usuarioRepository.buscarPorEmailParaAtualizacao("admin@example.com")).thenReturn(usuario);
        when(usuarioRepository.buscarPorGoogleSub("google-sub-10")).thenReturn(null);

        var autenticado = usuarioAcessoService.autenticarGoogle(
                " Admin@Example.com ",
                "google-sub-10",
                "Admin",
                "https://example.com/photo"
        );

        assertEquals("google-sub-10", usuario.googleSub);
        assertEquals("ADMIN", autenticado.perfil);
        assertEquals(10L, autenticado.usuarioId);
    }

    @Test
    void respeitaPerfilConsultaDefinidoNoBanco() {
        UsuarioAcesso usuario = usuario(17L, null, "CONSULTA", true);
        usuario.email = "consulta@example.com";
        when(usuarioRepository.buscarPorEmailParaAtualizacao("consulta@example.com")).thenReturn(usuario);
        when(usuarioRepository.buscarPorGoogleSub("google-sub-17")).thenReturn(null);

        var autenticado = usuarioAcessoService.autenticarGoogle(
                "consulta@example.com", "google-sub-17", "Consulta", null
        );

        assertEquals("CONSULTA", autenticado.perfil);
        assertEquals("google-sub-17", usuario.googleSub);
    }

    @Test
    void rejeitaUsuarioNaoCadastrado() {
        when(usuarioRepository.buscarPorEmailParaAtualizacao(anyString())).thenReturn(null);

        assertThrows(ForbiddenException.class, () -> usuarioAcessoService.autenticarGoogle(
                "unknown@example.com", "google-sub-11", "Unknown", null
        ));
    }

    @Test
    void rejeitaUsuarioInativo() {
        when(usuarioRepository.buscarPorEmailParaAtualizacao("inactive@example.com"))
                .thenReturn(usuario(12L, null, "ADMIN", false));

        assertThrows(ForbiddenException.class, () -> usuarioAcessoService.autenticarGoogle(
                "inactive@example.com", "google-sub-12", "Inactive", null
        ));
    }

    @Test
    void rejeitaSubDiferenteDoSubJaVinculado() {
        when(usuarioRepository.buscarPorEmailParaAtualizacao("admin@example.com"))
                .thenReturn(usuario(13L, "original-sub", "ADMIN", true));

        assertThrows(ForbiddenException.class, () -> usuarioAcessoService.autenticarGoogle(
                "admin@example.com", "different-sub", "Admin", null
        ));
    }

    @Test
    void rejeitaVincularSubJaAssociadoAOutraConta() {
        when(usuarioRepository.buscarPorEmailParaAtualizacao("admin@example.com"))
                .thenReturn(usuario(14L, null, "ADMIN", true));
        when(usuarioRepository.buscarPorGoogleSub("google-sub-15"))
                .thenReturn(usuario(15L, "google-sub-15", "CONSULTA", true));

        assertThrows(ForbiddenException.class, () -> usuarioAcessoService.autenticarGoogle(
                "admin@example.com", "google-sub-15", "Admin", null
        ));
    }

    @Test
    void rejeitaPerfilForaDosPerfisSuportados() {
        when(usuarioRepository.buscarPorEmailParaAtualizacao("unknown-role@example.com"))
                .thenReturn(usuario(16L, null, "SUPERADMIN", true));

        assertThrows(ForbiddenException.class, () -> usuarioAcessoService.autenticarGoogle(
                "unknown-role@example.com", "google-sub-16", "Unknown role", null
        ));
    }

    private UsuarioAcesso usuario(Long id, String sub, String perfil, boolean ativo) {
        UsuarioAcesso usuario = new UsuarioAcesso();
        usuario.id = id;
        usuario.email = perfil.equals("ADMIN") ? "admin@example.com" : "consulta@example.com";
        if (id == 12L) usuario.email = "inactive@example.com";
        if (id == 16L) usuario.email = "unknown-role@example.com";
        usuario.googleSub = sub;
        usuario.nome = "Usuário de teste";
        usuario.perfil = perfil;
        usuario.ativo = ativo;
        return usuario;
    }
}
