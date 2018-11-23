export function customHttpRequest(url, data) {
    return fetch(url, data).then(resolve, reject);
}

export function customHttpRequestPage(url, pageNumber, sort, data) {
    let urlVar = '';
    urlVar += `sort=${sort.field},${sort.direction}&`;
    urlVar += `page=${pageNumber}`;

    return fetch(url + '?' + urlVar, data)
        .then(resolve, reject)
    /*.catch(() => this.props.history.push('/login'))*/;

    // return fetch(url, data).then(resolve, reject);
}

function reject(reason) {
    console.log("reject", reason);

    // () => this.props.history.push('/login')
}

function resolve(response) {
    console.log('resolve', response);
    let error = {
        isError: !response.ok && !response.redirected,
        action: 'redirect',
        page: '',
        body: '',
    };
    if (response.status === 400) {
        return response.text().then(body => {
            error.action = 'bad';
            if (body.length > 0) {
                error.body = JSON.parse(body);
            }
        });
    } else if (response.status === 401) {
        error.isError = true;
        error.page = '/login';
    } else if (response.status === 403) {
        error.isError = true;
        error.page = '/403';
    } else if (response.status === 404) {
        error.isError = true;
        error.page = '/404';
    } else if (response.status > 499) {
        error.isError = true;
        error.page = '/50x';
    }

    if (error.isError) {
        return Promise.reject(error);
    }
    return response.text().then(body => {
        console.log('body empty', body, response);
        if (body.length > 0) {
            console.log('body', body);
            return Promise.resolve(JSON.parse(body));
        }
        return Promise.resolve('');
    });
    // () => this.props.history.push('/login')
}

// function rejectAfterParseJSON(reason) {
//     console.log("reject json", reason);
// }