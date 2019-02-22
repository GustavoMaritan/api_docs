module.exports = {
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
}