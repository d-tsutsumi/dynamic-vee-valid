<script setup lang="ts">
import { Form } from "vee-validate";
import * as Yup from "yup";
import TextInput from "./components/TextInput.vue";
import { RequiredStringSchema } from "yup/lib/string";
import NuField from "@/components/NuField.vue";
import { AnyObject } from "yup/lib/types";
import { ObjectShape } from "yup/lib/object";

function onSubmit(values: any) {
  console.log(values);
  alert(JSON.stringify(values, null, 2));
}
const schemaRef = ref();
const addInputFormArray = ref<string[]>([]);
function onInvalidSubmit() {
  const submitBtn = document.querySelector(".submit-btn") as HTMLButtonElement;
  submitBtn.classList.add("invalid");
  setTimeout(() => {
    submitBtn.classList.remove("invalid");
  }, 1000);
}

interface shemaType extends ObjectShape {
  [key: string]: RequiredStringSchema<string | undefined, AnyObject>;
  name: RequiredStringSchema<string | undefined, AnyObject>;
  confirm_password: RequiredStringSchema<string | undefined, AnyObject>;
  password: RequiredStringSchema<string | undefined, AnyObject>;
}

const test = ref<shemaType>({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});
schemaRef.value = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

const onClickHandle = () => {
  const name = `name_${addInputFormArray.value.length + 1}`;
  addInputFormArray.value = [...addInputFormArray.value, name];
  test.value[name] = Yup.string().min(6).required();
  schemaRef.value = Yup.object().shape(test.value as any);
};
</script>

<template>
  <div>
    <button @click="onClickHandle">test</button>
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
      <button class="submit-btn" type="submit">Submit</button>
    </Form>
    <NuField />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

:root {
  --primary-color: #0071fe;
  --error-color: #f23648;
  --error-bg-color: #fddfe2;
  --success-color: #21a67a;
  --success-bg-color: #e0eee4;
}

html,
body {
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;

  width: 100%;
  height: 100%;
}

form {
  width: 300px;
  margin: 0px auto;
  padding-bottom: 60px;
}

.submit-btn {
  background: var(--primary-color);
  outline: none;
  border: none;
  color: #fff;
  font-size: 18px;
  padding: 10px 15px;
  display: block;
  width: 100%;
  border-radius: 7px;
  margin-top: 40px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.submit-btn.invalid {
  animation: shake 0.5s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }
  10% {
    transform: translate(-1px, -2px);
  }
  20% {
    transform: translate(-3px, 0px);
  }
  30% {
    transform: translate(3px, 2px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(-1px, 2px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(3px, 1px);
  }
  80% {
    transform: translate(-1px, -1px);
  }
  90% {
    transform: translate(1px, 2px);
  }
  100% {
    transform: translate(1px, -2px);
  }
}

.submit-btn:hover {
  transform: scale(1.1);
}
</style>
