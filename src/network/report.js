import {instance1} from '../network/instance'

// 请求echarts数据
export function aReport() {
    return instance1({
        method:'get',
        url:'reports/type/1',
    })
}