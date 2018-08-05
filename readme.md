
# Use

```sh
api_docs create 
```

## Options

> -p, --path  
*Defini caminho para arquivo docs.js


## Middleware

* Pasta 'docs' como static.
* Cria rota /docs para carregar a página
```js
require('./docs/middleware')(express, app);
```

## Object JS

```js
//Cria arquivo docs.js
//Pasta raiz por default, ou informar pasta com -p
module.exports = {
    api: {
        name: '',
        url: '',
        prefix: '',
        headers: {},
        return: {},
    controllers: [
        {
            name: '',
            descricao: '',
            routes: [
                {
                    name: '',
                    method: '',
                    url: '',
                    descricao: '',
                    params: {},
                    bodyType: '',
                    bodyCase: {},
                    success: {}
                }
            ]
        }
    ]
}
```