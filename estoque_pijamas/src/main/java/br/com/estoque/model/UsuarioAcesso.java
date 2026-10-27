package br.com.estoque.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios_acesso")
public class UsuarioAcesso extends PanacheEntity {

    @Column(name = "google_sub", length = 255, unique = true)
    public String googleSub;

    @Column(nullable = false, length = 255, unique = true)
    public String email;

    @Column(length = 150)
    public String nome;

    @Column(nullable = false, length = 30)
    public String perfil = "CONSULTA";

    @Column(nullable = false)
    public boolean ativo = true;
}
