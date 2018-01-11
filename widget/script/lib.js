function setStorage(name,object){
    window.localStorage.setItem(name,JSON.stringify(object))
}
function readStorage(name){
    return JSON.parse(window.localStorage.getItem(name))
}
function clearStorage(){
    window.localStorage.clear();
}
function delStorage(name){
    window.localStorage.removeItem(name)
}
