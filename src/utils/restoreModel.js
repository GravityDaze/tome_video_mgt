// 还原data中的model数据
export function restore ( data ){
    for( const v in data ){
        if(Array.isArray(data[v])){
            data[v]=[]
        }else if( data[v] instanceof Object ){
            data[v]={}
        }else if( typeof data[v] === 'boolean' ){
            data[v]=false
        }else{
            data[v]=''
        }
    }
    return data
}