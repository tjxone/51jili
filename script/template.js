function createHeader (title){
  var headerHTML = document.createElement('div');
  headerHTML.className = 'nei-title';
  headerHTML.innerHTML = `<div class="back" tapmode onclick="api.closeWin()"><i class="icon-left-open-big"></i></div>
  <h1>${title}</h1>
  <div class="back"><i class="replace"></i></div>`;
  document.getElementsByTagName('body')[0].appendChild(headerHTML);
}
