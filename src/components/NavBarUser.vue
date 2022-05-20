<template>
    <div>
        <button @click="disconnect()">se deconnecter</button>
    </div>
</template>
<script>
export default {
    methods: {
        disconnect() {
            console.log("test");
            localStorage.clear();
            this.$router.push('/')
        }
    }
}
</script>