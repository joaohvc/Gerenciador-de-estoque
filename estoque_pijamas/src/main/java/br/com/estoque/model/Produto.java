package br.com.estoque.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import java.math.BigDecimal;

@Entity

public class Produto extends PanacheEntity {

    public String codigoFabrica;
    public String nome;
    public int tamanho;
    public int quantidade;
    public String genero;
    public String categoria;
    @Column(precision = 10, scale = 2)
    public BigDecimal preco;
    @Column(precision = 10, scale = 2)
    public BigDecimal precoComprado;

}
