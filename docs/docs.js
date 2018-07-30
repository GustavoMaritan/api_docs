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
        {
            name: 'Boletos',
            descricao: 'Manutenção de boletos',
            routes: [
                {
                    name: 'Gerar',
                    method: 'POST',
                    url: 'boleto/:banco?t',
                    descricao: 'Método responsavel por gerar boleto e retornar url para impressão ou download.',
                    params: {
                        banco: { required: true, opcoes: ['brasil', 'sicredi', 'sicoob'], type: String, testValue: 'brasil' },
                        t: { default: 'print', opcoes: ['print', 'download'], type: String }
                    },
                    bodyType: 'json', // Parametro para definir tipo body e bodyCase default=json
                    bodyCase: {
                        from: 'banco', // PARAMETRO CASE
                        itens: [
                            {
                                name: 'brasil',
                                value: {
                                    dataImpressao: { $options: true, type: Date, descricao: 'Data impressão do boleto', format: 'dd/MM/yyyy', default: '01/01/2000', testValue: '01/01/2000' },
                                    dataGeracaoBoleto: { $options: true, type: Date },
                                    numeroDocumento: String,
                                    especie: { $options: true, descricao: 'Especie fornecida pelo banco' },
                                    carteira: String,
                                    numeroConvenio: Number,
                                    pagador: {
                                        nome: { $options: true, format: 'xxxxx xxxxx xxxxx' },
                                        edereco: String,
                                        cep: String,
                                        cpfCnpj: String,
                                    },
                                    beneficiario: {
                                        nome: String,
                                        cpfCnpj: String,
                                        codigo: String,
                                        codigoDigito: String,
                                        agencia: String,
                                        agenciaDigito: String
                                    },
                                    parcelas: [{
                                        numero: Number,
                                        valor: Number,
                                        vencimento: Date,
                                        nossoNumero: String
                                    }]
                                }
                            },
                            {
                                name: 'sicredi',
                                value: {
                                    dataImpressao: Date,
                                    dataGeracaoBoleto: Date,
                                    numeroDocumento: String,
                                    especie: String,
                                    carteira: String,
                                    numeroConvenio: String,
                                    pagador: {
                                        nome: String,
                                        edereco: String,
                                        cep: String,
                                        cpfCnpj: String,
                                    },
                                    beneficiario: {
                                        nome: String,
                                        cpfCnpj: String,
                                        codigo: String,
                                        codigoDigito: String,
                                        agencia: String,
                                        agenciaDigito: String
                                    },
                                    parcelas: [{
                                        numero: Number,
                                        valor: Number,
                                        vencimento: Date,
                                        nossoNumero: String
                                    }]
                                }
                            },
                            {
                                name: 'sicoob',
                                value: {
                                    dataImpressao: Date,
                                    dataGeracaoBoleto: Date,
                                    numeroDocumento: String,
                                    especie: String,
                                    carteira: String,
                                    numeroConvenio: String,
                                    pagador: {
                                        nome: String,
                                        edereco: String,
                                        cep: String,
                                        cpfCnpj: String,
                                    },
                                    beneficiario: {
                                        nome: String,
                                        cpfCnpj: String,
                                        codigo: String,
                                        codigoDigito: String,
                                        agencia: String,
                                        agenciaDigito: String
                                    },
                                    parcelas: [{
                                        numero: Number,
                                        valor: Number,
                                        vencimento: Date,
                                        nossoNumero: String
                                    }]
                                }
                            }
                        ]
                    },
                    success: {
                        content: {
                            url: { $options: true, type: String, descricao: 'Url gerada para baixar ou imprimir o boleto' },
                            idBoleto: { $options: true, type: String, descricao: 'Id gerado no payment para relacionamento com api cliente' },
                            parcelas: [{
                                numero: { $options: true, type: Number, descricao: 'Número da parcela' },
                                nossoNumero: { $options: true, type: String, descricao: 'Nosso número ja gerado com o dígito' },
                                valor: { $options: true, type: Number, descricao: 'Valor da parcela' },
                                dataVencimento: { $options: true, type: Date, descricao: 'Data vencimento da parcela' }
                            }]
                        }
                    }
                },
                {
                    name: 'Imprimir',
                    method: 'GET',
                    url: '/ping',
                    noPrefix: true,
                    success: {
                        content: 'Arquivo .pdf'
                    },
                    error: String
                }
            ]
        },
        {
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