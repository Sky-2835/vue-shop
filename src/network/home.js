import {instance1} from './instance.js'

 export  function aGetAsideData(){
    return instance1({
        method:'get',
        url:'menus'
    })
}

