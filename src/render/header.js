const comuns = require('./comuns');

module.exports = header;

function header() {
    let model = {
        url: (comuns.obj.api.url + '/' + comuns.obj.api.prefix), //.replace(/\/\//g, '/'),
        headers: []
    };

    if (comuns.obj.api.headers)
        for (let i in comuns.obj.api.headers)
            model.headers.push({
                nome: i,
                tipo: comuns.typeName(comuns.obj.api.headers[i].type),
                descricao: comuns.obj.api.headers[i].descricao || '-',
            });

    let header = comuns.components('body-header');
    return comuns.vashCompile(header, model);
}