<template>
    <div>
        <div style="text-align: center">
            ici sera le menu du capchat qui permettra de récupérer le lien iframe
        </div>
        <button @click="getCapchat()">test</button>
        <div v-for="capchat in capchats" :key="capchat.ordre">
            <img style="width: 400px; height: auto" :src="'data:' + capchat.format + ';base64, ' + capchat.img" />
            <div v-if="capchat.ImageSinguliere">
                {{ capchat.TexteQuestion }}
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            capchats: null,
            idJeu: 23
        }
    },
    created() {
        // this.getCapchat();
    },
    methods: {
        getCapchat() {
            axios.get(`Capchat/${this.idJeu}`)
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