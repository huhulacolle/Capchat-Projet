<template>
    <div>
        <div style="text-align: center">
            ici sera le menu du capchat qui permettra de récupérer le lien iframe
        </div>
        <div v-for="capchat in capchats" :key="capchat.ordre">
            <img :src="'data:' + capchat.format + ';base64, ' + capchat.img" />
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            capchats: null
        }
    },
    created() {
        this.getCapchat();
    },
    methods: {
        getCapchat() {
            axios.get(`Capchat/${23}`)
            .then(
                data => {
                    console.log(data.data);
                    this.capchats = data.data;
                }
            )
            .catch(
                err => {
                    console.error(err);
                }
            )
        }
    }
}
</script>