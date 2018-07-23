const _header = require('./render/header');
const _controllers = require('./render/controllers');
const comuns = require('./render/comuns');
const fs = require('fs');

init();

function init() {
    let header = _header();
    let controllers = _controllers();

    let layout = comuns.componentCompile('layout', {
        title: comuns.obj.api.name,
        conteudo: header + controllers.join('')
    })

    fs.writeFileSync('./docs/index.html', layout, 'utf8');
    process.exit(-1);
}

