package br.com.estoque.DTO;

public class GoogleLoginResponse {
    public Long usuarioId;
    public String googleId;
    public String email;
    public String nome;
    public String foto;
    public String perfil;

    public GoogleLoginResponse(
            Long usuarioId,
            String googleId,
            String email,
            String nome,
            String foto,
            String perfil) {

        this.usuarioId = usuarioId;
        this.googleId = googleId;
        this.email = email;
        this.nome = nome;
        this.foto = foto;
        this.perfil = perfil;
    }
}
