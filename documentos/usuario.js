module.exports = {
    name: 'Usuário',
    descricao: 'Manutenção usuários do sistema',
    routes: [
        {
            name: 'Cadastrar',
            method: 'post',
            url: 'usario',
            body: {
                nome: String,
                idade: Number
            },
            //return: {} // Sobrepoem return api, desconcidera success e error declarados 
            success: {
                content: { id: Number }
            }
        },
        {
            name: 'Alterar',
            method: 'put',
            url: 'usuario/:id',
            params: {
                id: Number
            },
            body: {
                nome: String,
                idade: Number
            }
        },
        {
            name: 'Buscar',
            method: 'get',
            url: 'usuario/:id',
            params: {
                id: Number
            },
            success: {
                content: {
                    usuario: {
                        nome: String,
                        idade: Number
                    }
                }
            }
        },
        {
            name: 'Excluir',
            method: 'delete',
            url: 'usuario/:id',
            params: {
                id: Number
            }
        },
        {
            name: 'Selecionar',
            method: 'get',
            url: 'usuarios?pagina&quantidade',
            params: {
                pagina: { $options: true, default: 1, type: Number },
                quantidade: { $options: true, default: 10, type: Number }
            },
            success: {
                content: {
                    usuarios: Array
                }
            }
        }
    ]
}