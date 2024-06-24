<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue';
import { PURCHASES_ERROR_CODE, LOG_LEVEL, Purchases, PurchasesPackage } from "@revenuecat/purchases-capacitor";
import { Capacitor } from '@capacitor/core';


const pack = ref<PurchasesPackage | null>(null);

const configure = async () => {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG }); // Enable to get debug logs
    if (Capacitor.getPlatform() === 'ios') {
      await Purchases.configure({
        apiKey: "appl_HTamVMqZOenosCRyiTpxUbttIwN",
        appUserID: "test66",
      });
    } else if (Capacitor.getPlatform() === 'android') {
      console.log("Android platform is not supported yet.");
    };
  }


const initializePurchases = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    pack.value =
      offerings.current &&
      offerings.current.availablePackages &&
      offerings.current.availablePackages[0];
  } catch (error) {
    console.error(error);
  }
}

const purchaseMonthly = async () => {
  try {
    if (pack.value == null) {
      console.log("No packages available for purchase");
      return;
    }
    console.log("Purchasing product", pack.value);
    const purchaseResult = await Purchases.purchasePackage({
      aPackage: toRaw(pack.value)
    });

    console.log(purchaseResult);
    if (typeof purchaseResult.customerInfo.entitlements.active['premium'] !== "undefined") {
      // Unlock that great "pro" content (works)
      console.log("Unlocking pro content");
    }
    console.log("Purchase successful");
  } catch (error: any) {
    if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      // Purchase cancelled (works)
      console.error("Purchase cancelled");
      console.error(error);
    } else {
      // Error making purchase
      console.error("Error making purchase");
      console.error(error);
    }

  }
}

onMounted(async () => {
  await configure();
  await initializePurchases();
});

</script>

<template>
  <div>
    <div>
      <div>
        <span>title: {{ pack?.product.title }}</span>
      </div>
      <div>
        <span>description: {{ pack?.product.description }}</span>
      </div>
      <div>
        <span>price: {{ pack?.product.priceString }}</span>
      </div>
    </div>
    <button @click="purchaseMonthly()">Purchase</button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>./payment/IapService
