const vash = require('vash');
const fs = require('fs');
const path = require('path');
const docs_obj = require('../../docs/docs');

module.exports = {
    obj: docs_obj,
    components,
    vashCompile,
    typeName,
    componentCompile
}

function componentCompile(name, model) {
    let comp = components(name);
    return vashCompile(comp, model);
}

function components(name) {
    let _path = path.join(__dirname, '..', `components/${name}.html`)
    return fs.readFileSync(_path, 'utf8');
}

function vashCompile(html, model) {
    let tpl = vash.compile(html);
    return tpl({ t: model });
}

function typeName(value) {
    return !value
        ? ''
        : typeof value == 'function'
            ? value.name
            : value;
}