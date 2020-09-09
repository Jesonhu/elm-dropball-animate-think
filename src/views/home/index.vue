<template>
  <div>
    <hb-shop-cart/>
  </div>
</template>

<script>
import ShopCart from '@/components/Shopcart'

export default {
  name: 'Home',
  components: {
    HbShopCart: ShopCart
  },
}
</script>