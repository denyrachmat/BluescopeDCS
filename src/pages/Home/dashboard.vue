<template>
  <div>Halo user {{ userData.usrnm }}</div>
</template>

<script>
import { helpers } from "../../components/helpers";
export default {
  mixins: [helpers],
};
</script>