package br.com.estoque.validation;

import br.com.estoque.model.Produto;

import java.math.BigDecimal;

public class Validacao {
    public void validacaoCadastroProduto(Produto produto){

        if (produto == null) {
            throw new IllegalArgumentException(
                    "Os dados do produto não foram informados!"
            );
        }

        if (produto.codigoFabrica == null || produto.codigoFabrica.isBlank()) {
            throw new IllegalArgumentException("O codigo não foi digitado!");
        }

        if (produto.nome == null || produto.nome.isBlank()) {
            throw new IllegalArgumentException("O nome não digitado");
        }

        if (produto.tamanho > 19) {
            throw new IllegalArgumentException("O tamanho digitado é maior que 19 anos");
        } else if (produto.tamanho < 1) {
            throw new IllegalArgumentException("O tamanho digitado é menor do que 1");
        }

        if (produto.quantidade < 0) {
            throw new IllegalArgumentException("A quantidade não pode ser menor do que 0");
        }

        if (produto.genero == null ||
                (!produto.genero.equalsIgnoreCase("m") &&
                        !produto.genero.equalsIgnoreCase("f"))) {
            throw new IllegalArgumentException("O genero digitado é diferente de M ou F");
        }
        if (produto.preco == null) {
            throw new IllegalArgumentException("O preço não foi informado!");
        }

        if (produto.preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O preço deve ser maior que zero!");
        }
        if (produto.precoComprado == null) {
            throw new IllegalArgumentException("O preço não foi informado!");
        }

        if (produto.precoComprado.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O preço deve ser maior que zero!");
        }
        validacaoCategoria(produto);
    }

    public void validacaoAtualizarProduto(Produto produto) {

        if (produto == null) {
            throw new IllegalArgumentException(
                    "Os dados do produto não foram informados!"
            );
        }

        if (produto.codigoFabrica == null ||
                produto.codigoFabrica.isBlank()) {
            throw new IllegalArgumentException(
                    "O código não foi digitado!"
            );
        }

        if (produto.nome == null || produto.nome.isBlank()) {
            throw new IllegalArgumentException(
                    "O nome não foi digitado!"
            );
        }

        if (produto.tamanho < 1 || produto.tamanho > 18) {
            throw new IllegalArgumentException(
                    "O tamanho deve estar entre 1 e 18!"
            );
        }

        if (produto.quantidade < 0) {
            throw new IllegalArgumentException(
                    "A quantidade não pode ser negativa!"
            );
        }

        if (produto.genero == null ||
                (!produto.genero.equalsIgnoreCase("m") &&
                        !produto.genero.equalsIgnoreCase("f"))) {
            throw new IllegalArgumentException(
                    "O gênero deve ser M ou F!"
            );
        }
        if (produto.preco == null) {
            throw new IllegalArgumentException("O preço não foi informado!");
        }

        if (produto.preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O preço deve ser maior que zero!");
        }
        if (produto.precoComprado == null) {
            throw new IllegalArgumentException("O preço não foi informado!");
        }

        if (produto.precoComprado.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O preço deve ser maior que zero!");
        }
        validacaoCategoria(produto);
    }

    public void validacaoAtualizarQuantidade(int quantidade){
        if(quantidade < 0){
            throw new IllegalArgumentException(
                    "A quantidade não pode ser menor que 0"
            );
        }
    }

    private void validacaoCategoria(Produto produto) {
        if (produto.categoria == null ||
                (!produto.categoria.equalsIgnoreCase("curto") &&
                        !produto.categoria.equalsIgnoreCase("longo") &&
                        !produto.categoria.equalsIgnoreCase("kigurime"))) {
            throw new IllegalArgumentException(
                    "A categoria deve ser curto, longo ou kigurime!"
            );
        }
    }

}
