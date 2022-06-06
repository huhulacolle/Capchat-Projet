<template>
    <div>
        <NavBarConnexion />
        <!-- <span class="containers" style="display:inline-block; vertical-align:middle">
            <center>
                <div class="card card-block w-25">
                    <u>
                        <h1 class="animate__animated animate__rubberBand">Bienvenue dans captcha</h1>
                    </u>
                    <b>
                        <p class="animate__animated animate__lightSpeedInLeft">Selectionnez vos images</p>
                    </b>
                    <b>
                        <p class="animate__animated animate__lightSpeedInLeft">Créez vos propres captchas</p>
                    </b>
                </div>
            </center>
        </span> -->
        <!-- <div class="d-flex justify-content-center">
            <p class="display-1 animate__animated animate__backInDown"> Capchat 🐱 </p>
            <p class="h3">Selectionnez vos images</p>
            <p class="h3">Créez vos propres captchas</p>
        </div> -->
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