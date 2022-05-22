<template>
    <div>
        <NavBarConnexion />
        Bienvenue dans capchat
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