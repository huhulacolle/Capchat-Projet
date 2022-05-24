<template>
    <div>
        <NavBarConnexion />
        <span  class="containers" style="display:inline-block; vertical-align:middle">         
            <center>
                <div class="card card-block w-25">                            
                    <u><h1 class="animate__animated animate__rubberBand">Bienvenue dans captcha</h1></u>
                    <b><p class="animate__animated animate__lightSpeedInLeft">Selectionnez vos images</p></b>
                    <b><p class="animate__animated animate__lightSpeedInLeft">Créez vos propres captchas</p></b>     
                </div>
            </center>
        </span>
    </div>
</template>
<script>
import NavBarConnexion from '@/components/NavBarConnexion.vue'

export default {
    components: {
        NavBarConnexion
    },
    created() {
        if (localStorage.getItem('token')) {
            this.$router.push('/MonCompte')
        }
    }
}
</script>

<style scoped>
.containers {
    display: inline-block;
    min-width: 100vw;
    vertical-align: middle;
}
</style>