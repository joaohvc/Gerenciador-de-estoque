package br.com.estoque.resource;

import br.com.estoque.model.AtualizarQuantidadePRO;
import br.com.estoque.model.Produto;
import br.com.estoque.validation.Validacao;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.annotation.security.RolesAllowed;

import java.util.List;

@Path("/produtos")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProdutoResource {

    @GET
    @RolesAllowed({"ADMIN", "CONSULTA"})
    public List<Produto> listarUsuarios(){
        return Produto.listAll();
    }
    @GET
    @Path("/nome/{nome}")
    @RolesAllowed({"ADMIN", "CONSULTA"})
    public List<Produto> buscarPorNome(@PathParam("nome") String nome){
        return Produto.list("nome", nome);
    }
    @GET
    @Path("/codigo/{codigo}")
    @RolesAllowed({"ADMIN", "CONSULTA"})
    public List<Produto> buscarPorCodigo(@PathParam("codigo") String codigo){
        return Produto.list("codigoFabrica", codigo);
    }
    @GET
    @Path("/tamanho/{tamanho}")
    @RolesAllowed({"ADMIN", "CONSULTA"})
    public List<Produto> buscarPorTamanho(@PathParam("tamanho") int tamanho){
        return Produto.list("tamanho", tamanho);
    }



    Validacao vl = new Validacao();
    @POST
    @Transactional
    @RolesAllowed("ADMIN")
    public Response cadastrarProduto(Produto produto){
        try{
            vl.validacaoCadastroProduto(produto);
        }catch (Exception e){
            return Response.status(400).entity("Erro" + e.getMessage()).build();
        }

        produto.persist();
        return Response.status(200).entity("Dados gravados com sucesso").build();
    }



    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed("ADMIN")
    public void deletarID(@PathParam("id") Long id){
        Produto produto = Produto.findById(id);

        if(produto == null){
            throw new NotFoundException("Produto não encontrado!");
        }
        produto.delete();
    }


    @PUT
    @Path("{id}")
    @Transactional
    @RolesAllowed("ADMIN")
    public Produto atualizarProduto(@PathParam("id") Long id, Produto dadosAtualizados){

        Produto produto = Produto.findById(id);

        if(produto == null){
            throw new NotFoundException("Produto não encontrado!");
        }
        if(dadosAtualizados == null){
            throw new NullPointerException("Produto não encontrado!");
        }
        try{
            vl.validacaoAtualizarProduto(dadosAtualizados);
        }catch (IllegalArgumentException e){
            throw new BadRequestException(e.getMessage());
        }

        produto.nome = dadosAtualizados.nome;
        produto.codigoFabrica = dadosAtualizados.codigoFabrica;
        produto.tamanho = dadosAtualizados.tamanho;
        produto.quantidade = dadosAtualizados.quantidade;
        produto.genero = dadosAtualizados.genero;
        produto.categoria = dadosAtualizados.categoria;
        produto.preco = dadosAtualizados.preco;
        produto.precoComprado = dadosAtualizados.precoComprado;

        return produto;
    }

    @PUT
    @Path("/{id}/quantidade")
    @Transactional
    @RolesAllowed("ADMIN")
    public Produto atualizarQuantidade(@PathParam("id") Long id, AtualizarQuantidadePRO dados){

        Produto produto = Produto.findById(id);

        if(produto == null){
            throw new NotFoundException("Produto não encontrado!");
        }
        if(dados == null){
            throw new BadRequestException("Os dados da quantidade não foram informados!");
        }
        try{
            vl.validacaoAtualizarQuantidade(dados.quantidade);
        }catch (IllegalArgumentException e){
            throw new BadRequestException(e.getMessage());
        }

        produto.quantidade = dados.quantidade;
        return produto;
    }


}
