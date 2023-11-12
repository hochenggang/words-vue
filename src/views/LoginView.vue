<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();

const getApiCode = () => localStorage.getItem("x-api-code")
const setApiCode = (code: string) => localStorage.setItem("x-api-code", code)

function checkApiCode() {
  // check api-code
  console.log("checkApiCode start");

  const inputApiCode: string = route.query.code as string;
  if (inputApiCode) {
    // if x-api-code in route query args, cache it, and use by useLocalStorage
    setApiCode(inputApiCode)
    
    
  } else {
    // if not, redirect to account service
    if (!getApiCode()) {
      location.assign("https://account.imhcg.cn/to/5053d57018150d525ff95b4d10c9d289");
      return null
    }
  }
  console.log("authed.");
  router.push("/home");
  
}

onMounted(() => checkApiCode());
</script>

<template>
  <p>Wait moment...</p>
</template>