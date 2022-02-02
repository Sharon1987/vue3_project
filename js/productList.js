import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'sharon1987',
      products: [],
      isNew:false, //是否是新增的商品
      
      tempProduct: {
        imagesUrl:[],
      },
    }
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'login.html';
        })
    },
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios.get(url)
        .then((response) => {
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    updateProduct() {
    //更新商品列表
    let url= `${this.apiUrl}/api/${this.apiPath}/admin/product`;
    let http='';

    if(this.isNew===""){
      //isNew狀態為""時,打刪除API
      url+= `/${this.tempProduct.id}`;
      http='delete';
      axios[http](url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.data.message);
      })
      
    }    
 
else{ 
//isNew狀態不為""的時候,判斷是新增商品或是編輯商品
if(this.isNew){
  //新增商品
http='post';
}
else if(!this.isNew){
//不是新增商品(編輯商品),編輯商品要帶入product.id
http='put';
url+= `/${this.tempProduct.id}`;
}
axios[http](url, { data: this.tempProduct }).then((res) => {
  alert(res.data.message);
  productModal.hide();
  this.getData();
}).catch((err) => {
  alert(err.data.message);
})
}
  },

  openModal(modalStatus,item){
 if(modalStatus==="new"){
   this.tempProduct={
imagesUrl:[],
   };
   this.isNew=true;
   productModal.show();
 }else if(modalStatus==="edit"){
   this.tempProduct={...item};
   this.isNew=false;
   productModal.show();
 }else if(modalStatus==="delete"){
   this.tempProduct={...item};
   this.isNew="";
   delProductModal.show();
 }
  },

  createImages() {
    this.tempProduct.imagesUrl = [];
    this.tempProduct.imagesUrl.push('');
  },

}, 
  mounted() {

    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin()
  }
}).mount('#app');




