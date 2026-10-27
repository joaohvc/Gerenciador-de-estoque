package br.com.estoque.repository;


import br.com.estoque.model.UsuarioAcesso;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.LockModeType;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepository<UsuarioAcesso> {

    public UsuarioAcesso buscarPorEmailParaAtualizacao(String email) {
        return find("LOWER(email) = ?1", email)
                .withLock(LockModeType.PESSIMISTIC_WRITE)
                .firstResult();
    }

    public UsuarioAcesso buscarPorGoogleSub(String googleSub) {
        return find("googleSub", googleSub).firstResult();
    }
}
