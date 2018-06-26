import Headers from './headers'

export default (url, options) => {
  return new Promise((resolve, reject) => {
    const { body, headers, ...others } = options
    const request = {
      url,
      dataType: 'text',
      header: headers,
      ...others,
      complete: function (res) {
        errorHandler(resolve, reject, res)
      }
    }
    if (body) request.data = body
    wx.request(request)
  })
}

const errorHandler = function (resolve, reject, res) {
  var retData = res.data.errors ? res.data.errors[0].message : {
    code: 200
  }
  const ret = {
    text: () => Promise.resolve(res.data),
    json: () => Promise.resolve(res.data).then(JSON.parse),
    headers: new Headers(res.header)
  }
  // FIXME: https://www.apollographql.com/docs/link/links/http.html#custom
  // { 标准 fetch 返回的对象
  //   ok: (request.status/100|0) == 2,
  //   status: request.status,
  //   statusText: request.statusText,
  //   url: request.responseURL,
  //   clone: response,
  //   text: () => Promise.resolve(request.responseText),
  //   json: () => Promise.resolve(request.responseText).then(JSON.parse),
  //   blob: () => Promise.resolve(new Blob([request.response])),
  //   headers: {
  //     keys: () => keys,
  //     entries: () => all,
  //     get: n => headers[n.toLowerCase()],
  //     has: n => n.toLowerCase() in headers
  //   }
  // }
  if (res.statusCode === 200 && retData.code === 200) {
    resolve(ret)
  } else {
    reject(ret)
  }
}
