<template>
  <Form v-slot="{ values }">
    <Field name="email" type="email" />
    <Field name="password" type="password" />
    <pre>{{ values }}</pre>
  </Form>
</template>
<script setup lang="ts">
import { Form, Field } from "vee-validate";
</script>
