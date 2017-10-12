export const fetchUtil = (params={}) => {
  let {url, callBack, method='get', body={}} = params;
  url = 'http://localhost:8080' + url;
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json;charset=UTF-8');
  const fetchOptions = {
    method,
    headers,
  };
  const token = sessionStorage.getItem('token');
  if(token){
    body.token = token;
  }
  if (method !== 'get'){
    fetchOptions.body = JSON.stringify(body);
  } else {
    let params = [];
    for (let key in body) {
      params.push(`${key}=${body[key]}`)
    }
    url += `?${params.join('&')}`
  }
  const request = new Request(url, fetchOptions);
  fetch(url, fetchOptions).then(res => {
    res.json().then(result => {
      callBack(result)
    });
  });
}
