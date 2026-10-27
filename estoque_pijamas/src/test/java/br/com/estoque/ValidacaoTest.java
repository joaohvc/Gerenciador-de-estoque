package br.com.estoque;

import br.com.estoque.model.Produto;
import br.com.estoque.validation.Validacao;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ValidacaoTest {
    private final Validacao validacao = new Validacao();

    @Test
    void aceitaCategoriasDefinidasNoCadastroEAtualizacao() {
        for (String categoria : new String[]{"curto", "longo", "kigurime"}) {
            Produto produto = produtoComCategoria(categoria);
            assertDoesNotThrow(() -> validacao.validacaoCadastroProduto(produto));
            assertDoesNotThrow(() -> validacao.validacaoAtualizarProduto(produto));
        }
    }

    @Test
    void rejeitaGrafiaDeKigurumiDiferenteDoValorDaApi() {
        Produto produto = produtoComCategoria("kigurumi");
        assertThrows(IllegalArgumentException.class, () -> validacao.validacaoCadastroProduto(produto));
        assertThrows(IllegalArgumentException.class, () -> validacao.validacaoAtualizarProduto(produto));
    }

    private Produto produtoComCategoria(String categoria) {
        Produto produto = new Produto();
        produto.codigoFabrica = "JOL-001";
        produto.nome = "Pijama Aurora";
        produto.tamanho = 1;
        produto.quantidade = 3;
        produto.genero = "f";
        produto.categoria = categoria;
        produto.preco = new BigDecimal("69.90");
        produto.precoComprado = new BigDecimal("35.90");
        return produto;
    }
}
