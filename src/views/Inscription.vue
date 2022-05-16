<template>
  <div id="app">
    <form @submit.prevent="login">
      <div>
        <label for="username">username</label>
        <input name="username" v-model="username" placeholder="username">
      </div>
      <div>
        <label for="password">password</label>
        <input name="password" v-model="password" placeholder="password" type="password">
      </div>
      <div>
        <label for="firstName">first name</label>
        <input name="firstName" v-model="firstName" placeholder="first name">
      </div>
      <div>
        <label for="lastName">last name</label>
        <input name="lastName" v-model="lastName" placeholder="last name">
      </div>
<div>
        <label for="age">age</label>
        <input name="age" v-model="age" placeholder="age" type="number">
      </div>
      <div>
        <label for="address">address</label>
        <input name="address" v-model="address" placeholder="address">
      </div>
      <input type="submit" value="register">
    </form>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      age: "",
      address: ""
    };
  },
  methods: {
    async login() {
      const { username, password, firstName, lastName, age, address } = this;
      const res = await fetch(
        "https://SomberHandsomePhysics--five-nine.repl.co/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password,
            firstName,
            lastName,
            age,
            address
          })
        }
      );
      const data = await res.json();
      console.log(data);
    }
  }
};
</script>