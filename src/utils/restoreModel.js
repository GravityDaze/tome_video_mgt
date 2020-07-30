// 还原data中的model数据
import _ from 'lodash'
export function restore ( data ){
    for( const v in data ){
        if(_.isArray(data[v])){
            data[v]=[]
        }else if( _.isPlainObject(data[v]) ){
            data[v]={}
        }else if( typeof data[v] === 'boolean' ){
            data[v]=false
        }else{
            data[v]=''
        }
    }
    return data
}