<script setup lang="ts">
import { Form } from "vee-validate";
import * as Yup from "yup";
import TextInput from "@/components/shared/TextInput.vue";
import { getValidationShema } from "./lib/validShema";

const schemaRef = ref();
const addInputFormArray = ref<string[]>([]);
schemaRef.value = getValidationShema({});

/** Event handle */
function onSubmit(values: any) {
  console.log(values);
  alert(JSON.stringify(values, null, 2));
}
function onInvalidSubmit() {
  const submitBtn = document.querySelector(".submit-btn") as HTMLButtonElement;
  submitBtn.classList.add("invalid");
  setTimeout(() => {
    submitBtn.classList.remove("invalid");
  }, 1000);
}
const addNewTextForm = () => {
  const name = `name_${addInputFormArray.value.length + 1}`;
  addInputFormArray.value = [...addInputFormArray.value, name];
  const newShema = getValidationShema(
    {},
    { [name]: Yup.string().min(6).required() }
  );
  schemaRef.value = Yup.object().shape(newShema);
};

/** end */
</script>

<template>
  <div>
    <Form
      @submit="onSubmit"
      :validation-schema="schemaRef"
      @invalid-submit="onInvalidSubmit"
    >
      <TextInput
        name="name"
        type="text"
        label="Full Name"
        placeholder="Your Name"
        success-message="Nice to meet you!"
      />
      <TextInput
        name="email"
        type="email"
        label="E-mail"
        placeholder="Your email address"
        success-message="Got it, we won't spam you!"
      />
      <TextInput
        name="password"
        type="password"
        label="Password"
        placeholder="Your password"
        success-message="Nice and secure!"
      />
      <TextInput
        name="confirm_password"
        type="password"
        label="Confirm Password"
        placeholder="Type it again"
        success-message="Glad you remembered it!"
      />
      <template v-if="addInputFormArray.length !== 0">
        <TextInput
          v-for="inputName in addInputFormArray"
          :name="inputName"
          type="text"
          label="text"
          placeholder="Your Name"
          success-message="Nice to meet you!"
        />
      </template>
      <button class="submit-btn" type="button" @click="addNewTextForm">
        Add
      </button>
      <button class="submit-btn" type="submit">Submit</button>
    </Form>
  </div>
</template>
