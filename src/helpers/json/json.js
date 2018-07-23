
module.exports = {
    printJSON
}

function printJSON(content, print, edit) {
    let projetos = content;
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

/* PRIVATES HTML PRINT JSON */

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
                break;
        }
        if (count < objLength)
            attr.push('<span class="json-sinal">,</span>');
        attr.push('</div>');
        attrs.push(attr.join(''));
    }
    return attrs.join('');
}

/* ---------------------------- */
