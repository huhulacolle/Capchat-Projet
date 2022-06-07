<template>
    <div>
        <NavBarConnexion />
        <br><br><br><br><br><br><br><br><br><br>
        <p class="d-flex justify-content-center display-1 animate__animated animate__backInDown"> Capchat 🐱 </p>
        <p v-if="st1" class="d-flex justify-content-center h3 animate__animated animate__fadeIn"> Selectionnez vos images </p>
        <p v-if="st2" class="d-flex justify-content-center h3 animate__animated animate__fadeIn"> Créez vos propres captchas </p>
    </div>
</template>
<script>
import NavBarConnexion from '@/components/NavBarConnexion.vue'

export default {
    components: {
        NavBarConnexion
    },
    data() {
        return {
            st1: false,
            st2: false,
        }
    },
    created() {
        if (localStorage.getItem('token')) {
            this.$router.push('/MonCompte')
        }
    },
    mounted() {
        setTimeout(() => {
            this.st1 = true;
        }, 1500);
        setTimeout(() => {
            this.st2 = true;
        }, 2500);
    }
}
</script>

<style scoped>
/* .containers {
    display: inline-block;
    min-width: 100vw;
    vertical-align: middle;
} */
</style>