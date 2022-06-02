<template>
    <div>
        <div class="container">
            <div>
                <button @click="getCapchat()">refresh</button>
                <div class="row align-items-start">
                    <div class="col-sm" v-for="capchat in capchats" :key="capchat.ordre">
                        <img style="width: 150px; height: auto;" :src="'data:' + capchat.format + ';base64, ' + capchat.img" :alt="capchat.ordre" />
                        <div v-if="capchat.ImageSinguliere">
                            {{capchat.TexteQuestion}}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            idJeu: 23,
            capchats: null
        }
    },
    created() {
        this.getCapchat();
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
        },
    }
}
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>