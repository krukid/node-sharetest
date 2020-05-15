const qs = require('querystring')

const VALIDATORS = {
    string(v) {
        return typeof v === 'string'
    },
    url(v) {
        return this.string(v) && /^https?:\/\//i.test(v)
    },
    geometry(v) {
        return this.string(v) && /^[x\d+%!><^]+$/.test(v)
    },
    gravity(v) {
        return this.string(v) && /^\w+$/.test(v)
    }
}

function getValidatedParam(value, type) {
    const valid =
        value !== undefined
        && value !== null
        && VALIDATORS[type]
        && VALIDATORS[type].call(VALIDATORS, value)
    return valid ? value : null
}

function getValidatedParams(query, map) {
    return Object.keys(map).reduce((r, k) => {
        r[k] = getValidatedParam(query[k], map[k])
        return r
    }, {})
}

function getDecodedQuery(query) {
    return query.b64
        ? qs.parse(Buffer.from(query.b64, 'base64').toString('ascii'))
        : query
}

function getDecodedParams(query, map) {
    const decodedQuery = getDecodedQuery(query)
    return getValidatedParams(decodedQuery, map)
}

function getEncodedParams(query) {
    const querystring = qs.stringify(query)
    const querystring64 = Buffer.from(querystring).toString('base64')
    return `b64=${querystring64}`
}

exports.decode = getDecodedParams
exports.encode = getEncodedParams
