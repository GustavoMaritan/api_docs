const fs = require('fs');
const path = require('path');

module.exports = (express, app) => {
    app.use(express.static(path.join(process.cwd(), 'docs')));
    app.get('/docs', (req, res) => {
        let html = fs.readFileSync(path.join(process.cwd(), 'docs', 'index.html'), 'utf8');
        res.setHeader("Content-Type", 'text/html')
        res.write(html);
        res.status(200).end();
    })
}