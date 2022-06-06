<template>
    <div>
        <div class="container">
            <button @click="getCapchat()">refresh</button>
            <br>
            <div class="text-center ">
                <h4>{{indice}}</h4>
            </div>
            <div class="row align-items-start">
                <div class="col-sm" v-for="capchat in capchats" :key="capchat.ordre">
                    <img :id="capchat.ordre" @click="setReponse(capchat)" style="width: 150px; height: 150px;"
                        :src="'data:' + capchat.format + ';base64, ' + capchat.img" :alt="capchat.ordre" />
                </div>
            </div>
            <br>
            <div class="text-center" v-if="reponseBool">
                <h4>gg</h4>
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
            capchats: null,
            indice: null,
            reponseBool: null
        }
    },
    created() {
        this.getCapchat();
    },
    methods: {
        setReponse(capchat) {
            if (capchat.ImageSinguliere) {
                this.reponseBool = true;
            }
            else {
                this.reponseBool = false;
            }
        },
        getCapchat() {
            axios.get(`Capchat/${this.idJeu}`)
                .then(
                    data => {
                        console.log(data.data);
                        data.data.forEach(capchat => {
                            if (capchat.ImageSinguliere) {
                                this.indice = capchat.TexteQuestion;
                            }
                        });
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
img {
    cursor: pointer;
}
</style>