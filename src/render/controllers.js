const comuns = require('./comuns');
const JsonFormat = require('../helpers/json/json');

module.exports = controllers;

function controllers() {
    let ctrls = [];

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
                json: JSON.stringify(_newObj)
            };

            li.components.push(comuns.componentCompile('comuns/text', {
                label: 'Url',
                value: getUrl(comuns.obj.api, y.url)
            }));

            _getDescricao(li.components, y.descricao)
            _getHeader(li.components, y.headers);
            _getParams(li.components, y.params);
            _getBody(li.components, y.body, y.bodyType);
            _getBodyCase(li.components, y.bodyCase);
            _getReturn(li.components, comuns.obj.api, y.return, y.success, y.error);

            ctrl.lis.push({
                opcao: (`${x.name}-${li.nome}-${li.method}`).replace(/ /g, '').toLowerCase(),
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

function _getBody(collection, obj, type) {
    if (!obj) return;
    collection.push(comuns.componentCompile('comuns/text-json', {
        label: `Body`,
        value: _formatJson(obj)
    }));
}

function _getBodyCase(collection, obj) {
    if (!obj) return;
    collection.push(comuns.componentCompile('comuns/collection', {
        label: `Opções Body [Parâmetro=${obj.from}]`,
        value: _getCollectionItens(obj)
    }));
}

function _getReturn(collection, apiReturn, routeReturn, success, error) {

    let _return = JSON.parse(JSON.stringify((routeReturn || apiReturn.return || {})));
    _return.success = Object.assign(_return.success || {}, success || {});
    _return.error = Object.assign(_return.error || {}, error || {});

    _ret(_return.success, true);
    _ret(_return.error);

    function _ret(obj, success) {
        let labelDisplay = success ? `Success` : 'Error';

        let label = obj.status || obj.statusCode || obj.httpCode || obj.code;
        label = !label ? '' : typeof label == 'object' ? '' : label;

        let opt = {
            label: `${label ? labelDisplay : `<span style="color:${success ? 'green' : 'red'}">${labelDisplay}</span>`}`
                + ` ${label ? `<span style="color:${success ? 'green' : 'red'}">${label}</span>` : ''}`,
            type: 'text',
            name: 'comuns/text'
        };

        switch (typeof obj) {
            case 'object':
                opt.type = 'json';
                opt.name = 'comuns/text-json';
                opt.value = _formatJson(obj);
                break;
            default:
                opt.value = typeof obj == 'function'
                    ? obj.name.split('').map((x, i) => { return i == 0 ? x.toUpperCase() : x.toLowerCase() }).join('')
                    : obj;
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
    if (!json) return '';
    let jsonFormat = new JsonFormat(json, true);
    return jsonFormat.init();
}

function getUrl(api, route) {
    let _url = api.url.split('//');
    return [
        _url[0] + '//' + _url[1].split('/').filter(x => x).join('/'),
        api.prefix ? api.prefix.split('/').filter(x => x).join('/') : '',
        route ? route.split('/').filter(x => x).join('/') : ''
    ].filter(x => x).join('/');
}