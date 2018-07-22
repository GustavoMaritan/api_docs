let doc = {
    api: {
        name: 'Payment',
        url: 'http://localhost:11002',
        prefix: 'api',
        headers: { authorization: { type: String, descricao: 'Chave gerada pelo admin', testValue: '123' } }
    },
    controllers: [
        {
            name: 'Boletos',
            descricao: 'Métodos para geração de boletos',
            routes: [
                {
                    name: 'Gerar',
                    descricao: 'Método responsavel por gerar boleto e retornar url para impressão ou download.',
                    method: 'POST',
                    url: 'boleto/:banco',
                    //headers: { authorization: '' },
                    params: {
                        banco: { required: true, opcoes: ['brasil', 'sicredi', 'sicoob'], type: String, testValue: 'brasil' },
                        t: { default: 'print', opcoes: ['print', 'download'], type: String }
                    },
                    //body:{},
                    bodyCase: {
                        from: 'banco', // PARAMETRO CASE
                        itens: [
                            {
                                name: 'brasil',
                                value: {
                                    dataImpressao: { type: Date, descricao: 'Data impressão do boleto' },
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
                    return: {
                        type: 'json',
                        success: {
                            type: 'json',
                            status: 200,
                            content: {
                                url: { type: String, descricao: 'Url gerada para baixar ou imprimir o boleto' },
                                idBoleto: { type: String, descricao: 'Id gerado no payment para relacionamento com api cliente' },
                                parcelas: {
                                    type: Array,
                                    descricao: 'Dados da parcela',
                                    content: {
                                        numero: { type: Number, descricao: 'Número da parcela' },
                                        nossoNumero: { type: String, descricao: 'Nosso número ja gerado com o dígito' },
                                        valor: { type: Number, descricao: 'Valor da parcela' },
                                        dataVencimento: { type: Date, descricao: 'Data vencimento da parcela' }
                                    }
                                }
                            },
                            error: {
                            }
                        }
                    }
                }
            ]
        }
    ]
}