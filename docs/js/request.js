$(document).on('click', '[request-close]', function () {
    let req = $(this).closest('.request');
    req.find('.request-content').empty();
    req.slideUp();
});

$showRequest = () => {
    let divRow = $('<div>', { class: 'row' });
    let divCol12 = $('<div>', { class: 'col s12' });
    let divReqCard = $('<div>', { class: 'request-card' });

    return {
        create: create,
        close() {
            $('.request-content').empty();
            $('.request').slideUp();
        }
    }

    function create(api, controller, obj) {
        $('.request-content').html(gerarRequest(api, controller, obj));
        $('.request').css({ display: 'flex' });
        $('select').formSelect();
    }

    function gerarRequest(api, controller, obj) {
        obj = obj || {};
        let headers = { ...api.headers, ...obj.headers };

        let form = $('<form>', { class: 'col s12' });
        form
            .append(divRow.clone())
            //ADICIONA CARDS INICIAIS (**bind valores url ao alterar os parametros)
            .append(
                divRow.clone()
                    .append(divCol12.clone().append(divReqCard.clone().html(controller)))
                    .append(divCol12.clone().append(divReqCard.clone().html(`${obj.method} - ${obj.name}`)))
                    .append(divCol12.clone().append(divReqCard.clone().html(`${api.url}/${api.prefix}/${obj.url}`)))
            );

        //HEADERS, PARAMS, BODY
        let rowsBody = divRow.clone();
        if (Object.keys(headers).length) {
            let _div = divCol12.clone();
            _div.append(divCol12.clone().html('<h5>Headers</h5>'))
                .append(comp_params(headers, 'headers'))
            rowsBody.append(_div);
        }
        if (obj.params) {
            let _div = divCol12.clone();
            _div.append(divCol12.clone().html('<h5>Parâmetros</h5>'))
                .append(comp_params(obj.params, 'params'));
            rowsBody.append(_div);
        }

        if (obj.body) {
            //bodyType
            let _div = divCol12.clone();
            let jsonFormat = new $JsonFormat(obj.body, false, true);
            _div
                .append(divCol12.clone().html('<h5>Body</h5>'))
                .append(divCol12.clone().append($(`<div>`, {
                    class: "col s12 json",
                    html: jsonFormat.init()
                }).attr('data-body', 'body')));
            rowsBody.append(_div);
        }

        if (obj.bodyCase) {
            //bodyType
            let atePODERescolherOPCAO$GAMBI = obj.bodyCase.itens[0].value;
            if (atePODERescolherOPCAO$GAMBI) {
                let _div = divCol12.clone();
                let jsonFormat = new $JsonFormat(atePODERescolherOPCAO$GAMBI, false, true);
                _div
                    .append(divCol12.clone().html('<h5>Body</h5>'))
                    .append(divCol12.clone().append($(`<div>`, {
                        class: "col s12 json",
                        html: jsonFormat.init()
                    }).attr('data-body', 'body')));
                rowsBody.append(_div);
            }
        }
        form
            .append(divRow.clone().append(divCol12.clone().append(rowsBody)));

        let btnCancel = $('<a>', { class: 'btn', style: 'background-color: #cc0606; margin-left: 2px', text: 'Fechar' })

        btnCancel.click(() => {
            $('.request-content').empty();
            $('.request').slideUp();
        });

        form.append(divRow.clone().css({ 'text-align': 'right' }).append(
            divCol12.clone().append(btnCancel).append(btnSubmit(form, api, obj))
        ));
        return divRow.clone().append(form);
    }

    /* COMPONENTES */

    function btnSubmit(form, api, obj) {
        let btnSubmit = $('<a>', {
            class: 'btn',
            style: 'background-color: #a236f4; margin-left: 2px; width: 110px;',
            html: `<span>Testar Api</span>${loading()}`
        });

        btnSubmit.click(function () {
            let _btn = this;
            let request = carregarForm(_btn);
            if (!form.find('[data-result]').length) return send();

            form.find('[data-result]').slideUp(() => { send(); });
            function send() {
                let newResult = divRow.clone()
                    .css({ display: 'none' })
                    .attr('data-result', '');

                $(_btn).find('span').hide();
                $(_btn).find('.loading').addClass('on');

                $.ajax({
                    url: prepareUrl(api, obj.url, request.params),
                    method: obj.method.toUpperCase(),
                    headers: request.headers,
                    data: request.body,
                    dataType: 'javascript'
                }).done((res) => {
                    newResult.append(divCol12.clone()
                        .append('<div class="json">OIIIEEEEE</div>')
                    );
                    printResult(newResult)
                }).fail((err) => {
                    newResult.append(divCol12.clone()
                        .append(`<div class="json red">${err.message}</div>`)
                    );
                    printResult(newResult)
                }).always(() => {
                    $(_btn).find('span').show();
                    $(_btn).find('.loading').removeClass('on');
                });
            }
            function printResult(newResult) {
                form.find('[data-result]').remove();
                form.append(newResult);
                newResult.slideDown();
                form.closest('.request-content').animate({
                    scrollTop: form.find('[data-result]').position().top
                }, 1000);
            }
        });

        return btnSubmit;
    }

    /* AUXILIARES */

    function loading() {
        return `
        <div class="preloader-wrapper active loading">
            <div class="spinner-layer spinner loading-cor">
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div><div class="gap-patch">
                <div class="circle"></div>
            </div><div class="circle-clipper right">
                <div class="circle"></div>
            </div>
            </div>
        </div>
        `;
    }

    function carregarForm(btn) {
        let form = $(btn).closest('form');
        let body = form.find('[data-body]').text().trim();
        let request = {
            body: body ? JSON.parse(body) : undefined,
            headers: {},
            params: {}
        }
        form.find('[data-headers]').each(function () {
            request.headers[$(this).attr('data-headers')] = $(this).val();
        });
        form.find('[data-params]').each(function () {
            request.params[$(this).attr('data-params')] = $(this).val();
        });
        return request;
    }

    function comp_params(obj, name) {
        let body = [];
        for (let i in obj) {
            let input = {
                attr: name,
                name: i,
                required: '',
                value: '',
                type: 'string'
            }
            if (typeof obj[i] == 'object') {
                input.value = obj[i].testValue || obj[i].default || '';
                input.required = obj[i].required ? 'required' : '';
                input.type = obj[i].type
                    ? typeof obj[i].type == 'function'
                        ? obj[i].type.name
                        : obj[i].type
                    : '';
            }
            body.push(`
                <div class="col s12">
                    <div class="input-field col s6">
                        <input value="${(input.required ? '* ' : '') + i}" type="text" readonly>
                    </div>
                    <div class="input-field col s6">
                        ${comp_input_select(obj[i].opcoes, input)}
                    </div>
                </div>          
            `)
        }
        return body.join('');
    }

    function comp_input_select(opcoes, input) {
        if (!opcoes || !opcoes.length)
            return `<input 
                id="text" 
                data-${input.attr}="${input.name}"
                placeholder="${input.type}" 
                type="text" 
                value="${input.value}" ${input.required}>
            `;
        let opcs = opcoes
            .map(x => `<option value="${x}" ${input.value == x ? 'selected' : ''}>${x}</option>`);
        return `<select data-${input.attr}="${input.name}" ${input.required}>
                    ${opcs.join('')}
                </select>`;
    }

    function formatUrl(url, prefix, route) {
        url = url.substr(url.length - 1) == '/'
            ? url.substr(0, url.length - 1)
            : url;
        route = route.split('?')[0];
        route = route.split('/').filter(x => x).join('/');

        url = prefix ? `${url}/${prefix}` : url;
        url = `${url}/${route}`;
        return url;
    }

    function prepareUrl(api, route, params) {
        let url = formatUrl(api.url, api.prefix, route);
        params = params || {};
        let queryString = [];
        for (let i in params) {
            if (url.includes(':' + i))
                url = url.replace(':' + i, params[i]);
            else
                queryString.push(i + '=' + params[i]);
        }
        return url + (queryString.length ? '?' + queryString.join('&') : '');
    }
}
