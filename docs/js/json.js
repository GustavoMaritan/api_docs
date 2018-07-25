$(document).on('click', '[data-edit="off"]', function () {
    $(this).attr('data-edit', 'on');
    const tipo = $(this).attr('data-type') || 'string';
    let value = $(this).text().replace(/"/g, '');
    value = value == 'null' ? '' : value;
    $(this).html(`<input data-tipo="${tipo}" class="txt-edit-json" type="text" value="${value}">`)
    $('.txt-edit-json').focus().select();
});
$(document).on('focus', '.txt-edit-json', function (e) {
    $(this).attr('data-old-val', $(this).val().trim());
});
$(document).on('keypress', '.txt-edit-json', function (e) {
    if (e.keyCode == 13)
        $(this).trigger('focusout');
});
$(document).on('keyup', '.txt-edit-json', function (e) {
    if (e.keyCode != 27) return;
    $(this).val($(this).attr('data-old-val'));
    $(this).trigger('focusout');
});
$(document).on('focusout', '.txt-edit-json', function () {
    let value = $(this).val().trim();
    let tipo = $(this).attr('data-tipo').toLowerCase();
    let cls = 'json-value-' + (!value ? 'null' : tipo);
    if (!value) { value = 'null'; tipo = 'number'; }
    $(this).closest('span')
        .removeClass()
        .addClass(cls)
        .attr('data-edit', 'off')
        .html(`${tipo == 'number' || tipo == 'boolean' ? value : `"${value}"`}`);
});

class JsonFormat {
    constructor(json, print) {
        this.json = json;
        this.print = print;
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
                        attr.push(`<span data-type="${object[i].name.toLowerCase()}" class="json-value-null" data-edit="off">null</span>`);
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
                    if (!object[i].$options) {
                        let isArray = Array.isArray(object[i]);
                        attr.push(`<span class="json-sinal json-margin-left">${!isArray ? '{' : '['}</span>`);
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
                        } else {
                            attr.push(this._infoJSonEdit(object[i]));
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

    _infoJSonEdit(obj) {
        let value = obj.testValue || obj.default;
        let tp = obj.type
            ? typeof obj.type == 'function'
                ? obj.type.name
                : obj.type
            : value
                ? typeof value
                : 'string';
        let val = {
            type: tp.toLowerCase(),
            value: value || 'null',
            class: !value ? 'null' : tp.toLowerCase(),
            descricao: obj.format && !obj.descricao
                ? `Formato: ${obj.format}`
                : obj.descricao
                    ? `${obj.descricao}${obj.format ? `(${obj.format})` : ''}`
                    : ''
        };
        return `
            <span data-type="${val.type}" 
                title="${val.descricao}"
                class="json-value-${val.class}" 
                data-edit="off">${
                    val.type == 'boolean' ||
                    val.type == 'number' ||
                    val.value == 'null'
                        ? val.value
                        : `"${val.value}"`
            }</span>
        `;
    }

    _toCamelCase(value) {
        return (
            value.toLowerCase().substr(0, 1).toUpperCase() +
            value.toLowerCase().substr(1)
        )
    }
}

$JsonFormat = JsonFormat;