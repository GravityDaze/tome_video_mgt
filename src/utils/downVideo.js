import Vue from 'vue'; 
const vm = new Vue();
export function downVideo(url, name) {
     return vm.$axios({
          method: 'get',
          url,
          responseType: 'blob' 
     }).then(async response => {
          const href = URL.createObjectURL(response.data); //根据二进制对象创造新的链接
          const a = document.createElement('a');
          a.setAttribute('href', href);
          a.setAttribute('download', name);
          a.click();
          URL.revokeObjectURL(href);
     })

}