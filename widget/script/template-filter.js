template.defaults.imports.rateFormat = function(value){
    return parseFloat(value)
}
template.defaults.imports.classifyFormat = function(value){
    switch (value){
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
