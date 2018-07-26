const comuns = require('./comuns');
const JsonFormat = require('../helpers/json/json');

module.exports = controllers;

function controllers() {
    let ctrls = [];
    const _urlApi = comuns.obj.api.url + '/' + comuns.obj.api.prefix + '/';

    comuns.obj.controllers.forEach(x => {
        let ctrl = {
            nome: x.name,
            descricao: x.descricao,
            lis: []
        }
        x.routes.forEach(y => {
            let _newObj = {
                api: comuns.obj.api,
                controller: x.name,
                route: { ...y }
            };
            _removeClassType(_newObj);
            let li = {
                method: y.method,
                nome: y.name,
                components: [],
                json: JSON.stringify(_newObj)//''// 
            }

            li.components.push(comuns.componentCompile('comuns/text', {
                label: 'Url',
                value: _urlApi + y.url
            }));

            _getDescricao(li.components, y.descricao)
            _getHeader(li.components, y.headers);
            _getParams(li.components, y.params);
            _getBody(li.components, y.body);
            _getBodyCase(li.components, y.bodyCase);
            _getReturn(li.components, y.return);

            ctrl.lis.push({
                opcao: (`${x.name}-${li.nome}-${li.method}`).toLowerCase(),
                html: comuns.componentCompile('body-controllers-li', li)
            });
        });
        ctrls.push(comuns.componentCompile('body-controllers', ctrl));
    });

    return ctrls;
}

function _removeClassType(obj) {
    if (Array.isArray(obj))
        obj.map(x => _removeClassType(x));

    if (typeof obj != 'object') return;

    for (let i in obj) {
        if (typeof obj[i] == 'function' && i == 'type')
            obj[i] = obj[i].name;
        if (typeof obj[i] == 'function' && i != 'type')
            obj[i] = { $options: true, type: obj[i].name };
        if (typeof obj[i] == 'object')
            _removeClassType(obj[i]);
    }
}

function _getDescricao(collection, obj) {
    if (!obj) return;

    collection.push(comuns.componentCompile('comuns/text', {
        label: 'Descrição',
        value: obj
    }));
}

function _getHeader(collection, obj) {
    if (!obj) return;

    collection.push(comuns.componentCompile('comuns/grid', {
        label: 'Headers',
        value: _getGridTds(obj)
    }));
}

function _getParams(collection, obj) {
    if (!obj) return;

    collection.push(comuns.componentCompile('comuns/grid', {
        label: 'Parâmetros',
        value: _getGridTds(obj)
    }));
}

function _getBody(collection, obj) {
    if (!obj) return;
}

function _getBodyCase(collection, obj) {
    if (!obj) return;
    collection.push(comuns.componentCompile('comuns/collection', {
        label: `Opções Body [Parâmetro=${obj.from}]`,
        value: _getCollectionItens(obj)
    }));
}

function _getReturn(collection, obj) {
    if (!obj) return;
    if (obj.success) {
        let opt = {
            label: obj.success.status
                ? `Retorno <span style="color:green">${obj.success.status}</span>`
                : 'Retorno OK'
        };
        switch (obj.success.type) {
            case 'json':
                opt.name = 'comuns/text-json';
                opt.value = _formatJson(obj.success.content);
                break;
            default:
                opt.name = 'comuns/text';
                opt.value = obj.success.content;
                break;
        }
        collection.push(comuns.componentCompile(opt.name, opt));
    }
}

function _getGridTds(obj) {
    let tds = [];
    for (let i in obj) {
        const item = obj[i];
        tds.push({
            nome: i,
            tipo: item.type ? comuns.typeName(item.type) : '',
            opcoes: item.opcoes ? item.opcoes.join(',') : '',
            default: item.default || '',
            opcional: item.required ? 'Não' : 'Sim'
        })
    }
    return tds;
}

function _getCollectionItens(obj) {
    let itens = [];
    obj.itens.forEach(x => {
        itens.push({
            nome: x.name,
            value: _formatJson(x.value)
        })
    });
    return itens;
}

function _formatJson(json) {
    let jsonFormat = new JsonFormat(json, true);
    return jsonFormat.init();
}