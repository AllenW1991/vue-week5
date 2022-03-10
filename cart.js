import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'allenw';

const app = createApp({
  data() {
    return {
      cartData: {},
      products: [],
      productId: '',
      isLoadingItem: '',
    };
  },
  methods: {
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCart() {
      axios
        .get(`${apiUrl}/api/${apiPath}/cart`)
        .then((res) => {
          console.log(res);
          this.cartData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addCart(id, qty = 1) {
      console.log(id);
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data })
        .then((res) => {
          console.log(res);
          this.getCart();
          this.$refs.productModal.closeModal();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeCartItem(id) {
      this.isLoadingItem = id;
      axios
        .delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then((res) => {
          console.log(res);
          this.isLoadingItem = '';
          this.getCart();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateCartItem(item) {
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
        .then((res) => {
          console.log(res);
          this.getCart();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

app.component('product-modal', {
  props: ['id'],
  template: '#userProductModal',
  data() {
    return {
      modal: {},
      product: {},
      qty: 1,
    };
  },
  watch: {
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    getProduct() {
      axios
        .get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
        .then((res) => {
          this.product = res.data.product;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addCart() {
      this.$emit('add-cart', this.product.id, this.qty);
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
});
app.mount('#app');
