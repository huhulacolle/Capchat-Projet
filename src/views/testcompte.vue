<template>
    <div>
        <NavBarUser :nom=nom />
        <div style="text-align: center">Salut, ton nom est {{nom}}</div>
    </div>
</template>

<script>
import NavBarUser from '@/components/NavBarUser.vue'
import axios from 'axios'

export default {
    data() {
        return {
            nom: null
        }
    },
    created() {
        this.user();
    },
    components: {
        NavBarUser
    },
    methods: {
        user() {
            axios.get('compte', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(
                data => {
                    console.log(data.data);
                    this.nom = data.data.content.username
                }
            )
            .catch(
                error => {
                    console.log(error);
                    this.$router.push('/')
                }
            )
        }
    }
}
</script>