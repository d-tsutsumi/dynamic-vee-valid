
# dom操作で新たに生成したformにvalidationをつける。

- 通常vee-validateの```<Form />```はpropsのvalidationSchemaにuseFieldで指定したnameをkeyとしたyupのバリデーションスキーマのオブジェクトを入れる。<br />
(```<Form />```内の各inputタグはuseFieldで紐づけられているか、```<Field />```タグで実装されたもの)

```vue
<script setup lang="ts" >
import * as yup from "yup";
const shema = {
  name: yup.string().required() : yup.string().optional(),
  email: yup.string().email().required() : yup.string().optional(),
}
</script>
<template>
  <div>
    <Form
      @submit="onSubmit"
      :validation-schema="shema"
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
      <button class="submit-btn" type="submit">Submit</button>
    </Form>
  </div>
</template>
```
- 通常ならこれで問題ないが、例えば追加ボタン等をクリックして新しくフォームを作った場合バリデーションスキーマは固定されているので<br />
新しく生成されたフォームにはバリデーションが適用がされない。

そこでschemaをrefにして、フォームを追加するタイミングで前のバリデーションに新しいフォームのバリデーションを追加したスキーマを作成しrefに入れる。

```vue
<script setup lang="ts" >
schemaRef.value = getValidationShema({});
function addNewTextForm(){
  const name = `name_${addInputFormArray.value.length + 1}`;
  addInputFormArray.value = [...addInputFormArray.value, name];
  const newShema = getValidationShema({ [name]: Yup.string().min(6).required() });
  schemaRef.value = Yup.object().shape(newShema);
};
</script>
<template>
  <Form :validation-schema="schemaRef">
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
    <button type="button" @click="addNewTextForm">add</button>
  </Form>
</template>
```
バリデーションの作成の関数。

```ts
import { AnyObject } from "yup/lib/types";
import * as yup from "yup";

interface ValidBaseShema {
  name: yup.StringSchema<string | undefined, AnyObject>;
  email: yup.StringSchema<string | undefined, AnyObject>;
}

export interface RegistShema extends ValidBaseShema {
  [key: string]: yup.StringSchema<string | undefined, AnyObject>;
}

export interface AddValid {
  [key: string]:
    | yup.StringSchema<string | undefined, AnyObject>
    | yup.NumberSchema<number | undefined, AnyObject>;
}

// 追加した前回のバリデーション
let addValid: AddValid = {}

export function getValidationShema(dynamicForms?: AddValid): RegistShema {
  // TODO ここの shemaも動的にするとutil化できるかも。
  const shema = {
    name:yup.string().required() : yup.string().optional(),
    email:yup.string().email().required() : yup.string().optional(),
  };
  if (!dynamicForms) return shema;
  addValid = {...addValid, ...dynamicForms }
  return { ...shema, ...addValid };
}
```
