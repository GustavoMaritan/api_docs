class JsonFormat {
    constructor(json, print, edit) {
        this.json = json;
        this.print = print;
        this.edit = edit;
    }

    init() {
        let html = [];
        if (Array.isArray(this.json)) {
            html = [this._jsonSpan('sinal', '[')];
            this.json.map((x, i) => {
                html.push(this._jsonObject(this._jsonObjectContent(x, i < this.json.length - 1)))
            });
            html.push(this._jsonSpan('sinal', ']'))
        } else {
            html.push(this._jsonObject(this._jsonObjectContent(this.json), null, true));
        }
        return html.join('');
    }

    _jsonSpan(classe, value, margin) {
        return `<span class="json-${classe} ${margin ? 'json-margin' : ''}">${value}</span>`;
    }

    _jsonObject(conteudo, margin, primary) {
        return `<div class="json-object${margin ? ' json-margin' : ''}${primary ? ' primary' : ''}">${conteudo}</div>`;
    }

    _jsonObjectContentFooter(next) {
        let footer = [
            '<div class="json-footer json-margin">',
            '<span class="json-sinal">}</span>'
        ]
        if (next) footer.push('<span class="json-sinal">,</span>');
        footer.push('</div>');
        return footer.join('');
    }

    _jsonObjectContent(object, next) {
        let attr = [this._jsonSpan('sinal', '{', true)];
        attr.push(this._jsonObjectContentAttr(object));
        attr.push(this._jsonObjectContentFooter(next));
        return attr.join('');
    }

    _jsonObjectContentAttr(object) {
        let attrs = [],
            count = 0,
            objLength = Object.keys(object).length;
        for (let i in object) {
            let virgula = true;
            count++;
            let attr = [
                '<div class="json-attr json-margin">',
                `<span class="json-key json-margin">"${i}"</span>`,
                '<span class="json-sinal">:</span>'
            ];
            switch (typeof object[i]) {
                case 'function':
                    if (this.print)
                        attr.push(`<span data-type="${object[i].name.toLowerCase()}" class="json-value-class">${object[i].name}</span>`);
                    else {
                        attr.push(`<span data-type="${object[i].name.toLowerCase()}" class="json-value-null" ${this.edit ? 'data-edit="off"' : ''}>null</span>`);
                    }
                    break;
                case 'string':
                    if (object[i].includes('\\')) object[i] = object[i].replace(/\\/g, '\\\\');
                    attr.push(`<span data-type="string" class="json-value-string">"${object[i]}"</span>`);
                    break;
                case 'number':
                    attr.push(`<span data-type="number" class="json-value-number">${object[i]}</span>`);
                    break;
                case 'date':
                    attr.push(`<span data-type="date" class="json-value-string">"${object[i]}"</span>`);
                    break;
                case 'object':
                    if (!object[i].info_json) {
                        let isArray = Array.isArray(object[i]);
                        attr.push(`<span class="json-sinal">${!isArray ? '{' : '['}</span>`);
                        if (isArray) {
                            object[i].map((x, y) => {
                                if (typeof x == 'object')
                                    attr.push(this._jsonObject(this._jsonObjectContent(x, y < object[i].length - 1), true))
                                else {
                                    attr.push(`<span class="json-value-string json-margin">${object[i]}</span>`);
                                }
                            });
                            attr.push('<span class="json-sinal json-margin">]</span>');
                        } else {
                            attr.push(this._jsonObjectContentAttr(object[i]));
                            attr.push('<span class="json-sinal json-margin">}</span>');
                        }
                    } else {
                        if (this.print) {
                            attr.push(this._infoJSonPrint(object[i]));
                            virgula = false;
                        }
                    }
                    break;
            }
            if (count < objLength && virgula)
                attr.push('<span class="json-sinal">,</span>');
            attr.push('</div>');
            attrs.push(attr.join(''));
        }
        return attrs.join('');
    }

    _infoJSonPrint(obj) {
        let html = [];
        if (obj.type) {
            html.push(`<span class="json-value-class">${
                typeof obj.type == 'function'
                    ? obj.type.name
                    : this._toCamelCase(obj.type)
                }</span>`);
        } else if (obj.default) {
            let t = typeof obj.default;
            html.push(`<span class="json-value-class">${this._toCamelCase(t)}</span>`);
        } else {
            html.push(`<span class="json-value-class">String</span>`);
        }
        html.push('<span class="json-sinal">,</span>');
        if (obj.descricao)
            html.push(`<span class="json-value-coment">//${obj.descricao + (obj.format ? `(${obj.format})` : '')}</span>`);
        if (obj.format && !obj.descricao)
            html.push(`<span class="json-value-coment">//Formato: ${obj.format}</span>`);

        return html.join('');
    }

    _toCamelCase(value) {
        return (
            value.toLowerCase().substr(0, 1).toUpperCase() +
            value.toLowerCase().substr(1)
        )
    }
}

module.exports = JsonFormat;

/*
function printJSON(projetos, print, edit) {
    let html = [];
    if (Array.isArray(projetos)) {
        html = [_jsonSpan('sinal', '[')];
        projetos.map((x, i) => {
            html.push(_jsonObject(_jsonObjectContent(x, i < projetos.length - 1)))
        });
        html.push(_jsonSpan('sinal', ']'))
    } else {
        html.push(_jsonObject(_jsonObjectContent(projetos), null, true));
    }
    return html.join('');
}

function _jsonSpan(classe, value, margin) {
    return `<span class="json-${classe} ${margin ? 'json-margin' : ''}">${value}</span>`;
}

function _jsonObject(conteudo, margin, primary) {
    return `<div class="json-object${margin ? ' json-margin' : ''}${primary ? ' primary' : ''}">${conteudo}</div>`;
}

function _jsonObjectContentFooter(next) {
    let footer = [
        '<div class="json-footer json-margin">',
        '<span class="json-sinal">}</span>'
    ]
    if (next) footer.push('<span class="json-sinal">,</span>');
    footer.push('</div>');
    return footer.join('');
}

function _jsonObjectContent(object, next) {
    let attr = [_jsonSpan('sinal', '{', true)];
    attr.push(_jsonObjectContentAttr(object));
    attr.push(_jsonObjectContentFooter(next));
    return attr.join('');
}

function _jsonObjectContentAttr(object) {
    let attrs = [],
        count = 0,
        objLength = Object.keys(object).length;
    for (let i in object) {
        count++;
        let attr = [
            '<div class="json-attr json-margin">',
            `<span class="json-key json-margin">"${i}"</span>`,
            '<span class="json-sinal">:</span>'
        ];
        switch (typeof object[i]) {
            case 'function':
                attr.push(`<span class="json-value-class">${object[i].name}</span>`);
                break;
            case 'string':
                if (object[i].includes('\\')) object[i] = object[i].replace(/\\/g, '\\\\');
                attr.push(`<span class="json-value-string">"${object[i]}"</span>`);
                break;
            case 'number':
                attr.push(`<span class="json-value-number">${object[i]}</span>`);
                break;
            case 'date':
                attr.push(`<span class="json-value-string">"${object[i]}"</span>`);
                break;
            case 'object':
                if (!object[i].info_json) {
                    let isArray = Array.isArray(object[i]);
                    attr.push(`<span class="json-sinal">${!isArray ? '{' : '['}</span>`);
                    if (isArray) {
                        object[i].map((x, y) => {
                            if (typeof x == 'object')
                                attr.push(_jsonObject(_jsonObjectContent(x, y < object[i].length - 1), true))
                            else {
                                attr.push(`<span class="json-value-string json-margin">${object[i]}</span>`);
                            }
                        });
                        attr.push('<span class="json-sinal json-margin">]</span>');
                    } else {
                        attr.push(_jsonObjectContentAttr(object[i]));
                        attr.push('<span class="json-sinal json-margin">}</span>');
                    }
                }

                break;
        }
        if (count < objLength)
            attr.push('<span class="json-sinal">,</span>');
        attr.push('</div>');
        attrs.push(attr.join(''));
    }
    return attrs.join('');
}
*/