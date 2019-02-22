module.exports = {
    api: {
        name: 'Payment',
        url: 'http://localhost:3000',
        prefix: 'api',
        headers: { authorization: { type: String, descricao: 'Chave gerada pelo admin', testValue: '123' } },
        return: {
            success: {
                status: 200,
                content: null
            },
            error: {
                status: 500,
                content: {
                    messages: [],
                    fields: {}
                }
            }
        }
    },
    controllers: [
        require(`./boleto`),
        require(`./usuario`)
    ]
}

/*
request post - body -- OK
request post - bodyCase (Colocar opcao por parametro)
request post - body=json -> opcao d adicionar/remover item a lista quando attr array

opcoes para status return
NoPrefix - Attr no objeto para nao usar prefix pra montar rota
Default Return
tipos de requisicao
tipos de retorno
tratar url docs
embelezar url api na index
*/