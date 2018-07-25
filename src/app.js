
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", req.headers['access-control-request-headers']);

    if (req.method === 'OPTIONS')
        return res.status(204).end();
    next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
    res.status(200).json({ ok: 'OK' })
})

app.post('/api/boleto/:banco', (req, res) => {
    res.status(200).json({ ok: 'OK' })
})

app.listen(3000, () => {
    console.log('Servidor rodando, porta:' + 3000);
});

return;

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

