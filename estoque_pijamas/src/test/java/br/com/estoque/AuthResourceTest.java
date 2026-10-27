package br.com.estoque;

import br.com.estoque.DTO.GoogleLoginResponse;
import br.com.estoque.service.SessionService;
import br.com.estoque.service.UsuarioAcessoService;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.when;

@QuarkusTest
class AuthResourceTest {

    @Inject
    SessionService sessionService;

    @InjectMock
    UsuarioAcessoService usuarioAcessoService;

    @Test
    void exigeSessaoParaConsultarEstoque() {
        given()
                .when().get("/produtos")
                .then()
                .statusCode(401);
    }

    @Test
    void permiteAcessoComSessaoValida() {
        GoogleLoginResponse usuario = usuario(1L, "ADMIN");
        SessionService.SessionCredentials sessao = sessionService.criar(usuario);
        when(usuarioAcessoService.buscarUsuarioAtivo(1L)).thenReturn(Optional.of(usuario));

        given()
                .cookie("JOLU_SESSION", sessao.id())
                .when().get("/produtos")
                .then()
                .statusCode(200);

        given()
                .cookie("JOLU_SESSION", sessao.id())
                .contentType("application/json")
                .body("{}")
                .when().post("/produtos")
                .then().statusCode(400);
    }

    @Test
    void usuarioConsultaPodeListarMasNaoPodeAlterarEstoque() {
        GoogleLoginResponse usuario = usuario(2L, "CONSULTA");
        SessionService.SessionCredentials sessao = sessionService.criar(usuario);
        when(usuarioAcessoService.buscarUsuarioAtivo(2L)).thenReturn(Optional.of(usuario));

        given()
                .cookie("JOLU_SESSION", sessao.id())
                .when().get("/produtos")
                .then().statusCode(200);
        given()
                .cookie("JOLU_SESSION", sessao.id())
                .when().get("/produtos/nome/pijama")
                .then().statusCode(200);
        given()
                .cookie("JOLU_SESSION", sessao.id())
                .when().get("/produtos/tamanho/1")
                .then().statusCode(200);

        given()
                .cookie("JOLU_SESSION", sessao.id())
                .contentType("application/json")
                .body("{}")
                .when().post("/produtos")
                .then().statusCode(403);

        given()
                .cookie("JOLU_SESSION", sessao.id())
                .contentType("application/json")
                .body("{}")
                .when().put("/produtos/1")
                .then().statusCode(403);

        given()
                .cookie("JOLU_SESSION", sessao.id())
                .when().put("/produtos/1/quantidade")
                .then().statusCode(403);

        given()
                .cookie("JOLU_SESSION", sessao.id())
                .when().delete("/produtos/1")
                .then().statusCode(403);
    }

    @Test
    void sessaoDeUsuarioInativoEInvalidada() {
        GoogleLoginResponse usuario = usuario(3L, "ADMIN");
        SessionService.SessionCredentials sessao = sessionService.criar(usuario);
        when(usuarioAcessoService.buscarUsuarioAtivo(3L)).thenReturn(Optional.empty());

        given()
                .cookie("JOLU_SESSION", sessao.id())
                .when().get("/produtos")
                .then().statusCode(401);

        org.junit.jupiter.api.Assertions.assertTrue(
                sessionService.buscarUsuarioId(sessao.id()).isEmpty()
        );
    }

    @Test
    void exigeSessaoParaAlterarEstoque() {
        given()
                .contentType("application/json")
                .body("{}")
                .when().post("/produtos")
                .then().statusCode(401);

        given()
                .contentType("application/json")
                .body("{}")
                .when().put("/produtos/1")
                .then().statusCode(401);

        given()
                .when().delete("/produtos/1")
                .then().statusCode(401);
    }

    @Test
    void exigeSessaoParaEndpointsAlternativosDeConsulta() {
        given().when().get("/produtos/nome/pijama").then().statusCode(401);
        given().when().get("/produtos/codigo/JOL-001").then().statusCode(401);
        given().when().get("/produtos/tamanho/1").then().statusCode(401);
        given().when().put("/produtos/1/quantidade").then().statusCode(401);
    }

    @Test
    void rejeitaTokenGoogleInvalidoSemCriarSessao() {
        given()
                .contentType("application/json")
                .body("{\"credential\":\"token-invalido\"}")
                .when().post("/auth/google")
                .then().statusCode(401);

        given()
                .when().get("/auth/session")
                .then()
                .statusCode(401)
                .body("message", equalTo("Sessão inválida ou expirada."));
    }

    @Test
    void logoutExpiraCookieMesmoSemSessaoValida() {
        given()
                .when().post("/auth/logout")
                .then()
                .statusCode(204)
                .header("Set-Cookie", org.hamcrest.Matchers.containsString("JOLU_SESSION="));
    }

    private GoogleLoginResponse usuario(Long id, String perfil) {
        return new GoogleLoginResponse(
                id,
                "google-sub-" + id,
                "user" + id + "@example.com",
                "Usuário " + id,
                null,
                perfil
        );
    }
}
