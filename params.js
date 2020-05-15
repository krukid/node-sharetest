const PARAM_TYPES = {
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

function getParam(value, type) {
    if (value !== undefined && value !== null && type in PARAM_TYPES && PARAM_TYPES[type].call(PARAM_TYPES, value)) {
        return value
    }
    return null
}

function getParams(query, map) {
    return Object.keys(map).reduce((r, k) => {
        r[k] = getParam(query[k], map[k])
        return r
    }, {})
}

exports.getParam = getParam;
exports.getParams = getParams;
