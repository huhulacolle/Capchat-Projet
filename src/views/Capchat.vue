<template>
    <div>
        <button class="btn btn-primary" @click="refresh()"><i class="bi bi-arrow-counterclockwise"></i></button>
        <br>
        <div class="d-flex justify-content-center" v-if="loading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div class="text-center ">
            <h4>{{time}}</h4>
            <h4>{{indice}}</h4>
        </div>
        <div v-if="erreurBool" class="text-center h4 alert alert-danger">
            {{erreurTexte}}
        </div>
        <div class="row align-items-start">
            <div class="col-sm" v-for="capchat in capchats" :key="capchat.ordre">
                <img :id="capchat.ordre" @click="setReponse(capchat)" class="capchat"
                    :src="'data:' + capchat.format + ';base64, ' + capchat.img" :alt="capchat.ordre" />
            </div>
        </div>
        <br>
        <div class="text-center" v-if="reponseBool">
            <div class="row align-items-center">
                <div class="col">
                    <img src="@/assets/bird.gif" alt="gg" style="width: 100px; height: 100px;">
                </div>
                <div class="col">
                    <h4>Capchat Ch'est fait 👌</h4>
                    <h5><a :href="$route.query.link" target="_blank"> {{$route.query.link}} </a></h5>
                </div>
                <div class="col">
                    <img src="@/assets/bird.gif" class="capchat"
                        style="width: 100px; height: 100px; transform: scaleX(-1)">
                </div>
            </div>
        </div>
        <div class="text-center" v-if="erreur">
            <h4>Erreur</h4>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            loading: true,
            capchats: null,
            indice: null,
            reponseBool: false,
            erreur: false,
            link: null,
            time: 60,
            timeout: null,
            erreurBool: false,
            erreurTexte: null
        }
    },
    created() {
        this.getCapchat();
    },
    methods: {
        timer() {
            if (this.time > 0) {
                this.timeout = setTimeout(() => {
                    this.time--;
                    this.timer();
                }, 1000);
            } else {
                this.refresh();
            }
        },
        setReponse(capchat) {
            if (!this.reponseBool) {
                if (capchat.ImageSinguliere) {
                    document.getElementById(capchat.ordre).style = "border: solid blue;"
                    this.erreur = false;
                    this.reponseBool = true;
                    clearTimeout(this.timeout);
                } else {
                    document.getElementById(capchat.ordre).style = "border: solid red;"
                    this.time -= 5
                    this.reponseBool = false;
                    this.erreur = true;
                }
            }
        },
        getCapchat() {
            this.erreur = false;
            this.reponseBool = false;
            axios.get(`Capchat/${this.$route.query.idJeu}`)
                .then(
                    data => {
                        this.loading = false;
                        this.capchats = data.data;
                        console.log(data.data);
                        this.timer();
                        this.capchats.forEach(capchat => {
                            if (document.getElementById(capchat.ordre)) {
                                document.getElementById(capchat.ordre).style = "";
                            }
                            if (capchat.ImageSinguliere) {
                                this.indice = capchat.TexteQuestion;
                            }
                        });
                    }

                )
                .catch(
                    err => {
                        this.erreurTexte = JSON.parse(err.request.response).erreur;
                        this.erreurBool = true;
                        console.error(err);
                    }
                )
        },
        refresh() {
            this.indice = null;
            this.capchats = null;
            this.loading = true;
            this.time = 60;
            this.getCapchat();
        }
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

.capchat {
    width: 150px;
    height: 150px;
}
</style>