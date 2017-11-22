template.defaults.imports.rateFormat = function(value) {
    return parseFloat(value)
}
template.defaults.imports.classifyFormat = function(value) {
    switch (value) {
        case 'pubtime':
            return '期限'
            break;
        case 'rate':
            return '收益'
            break;
        case 'bdtype':
            return '项目'
            break;
    }

}
template.defaults.imports.fromDate = function(value) {
    var value = new Date(value * 1000).toLocaleDateString().replace(/\//g, "-") + ' ' + new Date(value * 1000).toTimeString().substr(0, 8);
    return value;
}