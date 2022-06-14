<template>
    <div>
        <div class="container">
            <div class="row align-items-start">
                <div class="col">
                    <div class="text-center h5">
                        Vous devez d'abord choisir un jeu et le lien de redirection
                        <br>
                        <img src="@/assets/bas.png" alt="bas"  width="200">
                    </div>
                    
                    <select id="idJeu" class="form-control" required>
                        <option disabled selected hidden>Choisir jeu</option>
                        <option v-for="jeu in listJeu" :key="jeu" :value="jeu.id" @click="setJeu()"> {{jeu.nom}}
                        </option>
                    </select>
                    <br>
                    <input type="text" class="form-control" v-model="link" placeholder="Lien">
                </div>
                <div class="col text-center">
                    <br><br><br><br><br>
                    <img src="@/assets/droite.png" alt="bas"  width="200">
                </div>
                <div class="col">
                    <br><br><br><br><br><br><br>
                    <div class="text-center h5">
                        Copier le lien et l'inclure dans votre site Web
                    </div>
                    <br>
                    <input type="text" id="link" class="form-control" @click="copy()"
                        :value="`<iframe src='${this.url}?idJeu=${this.idJeu}&link=${this.link}' width='600' height='700'></iframe>`"
                        readonly>
                    <br>
                    <div v-if="erreur" class="alert alert-danger animate__animated animate__bounceIn" role="alert">
                        Vous avez oublié d'insérer le lien ou de choisir le jeu
                    </div>
                    <div v-if="copie" class="alert alert-success animate__animated animate__bounceIn" role="alert">
                        Balise html Copié dans le presse-papier
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
            listJeu: null,
            idJeu: null,
            url: "http://localhost:8080/Capchat/",
            link: null,
            erreur: false,
            copie: false
        }
    },
    created() {
    this.getListJeu();
    },
    methods: {
        getListJeu() {
            axios.get('ListJeu')
                .then(
                    data => {
                        this.listJeu = data.data
                    }
                )
                .catch(
                    err => {
                        console.error(err);
                    }
                )
        },
        setJeu() {
            this.idJeu = document.getElementById('idJeu').value;
        },
        copy() {
            if (!this.link && !this.value) {
                console.log("t'es con ?");
                this.copie = false;
                this.erreur = true;
            }
            else {
                navigator.clipboard.writeText(document.getElementById('link').value);
                this.erreur = false;
                this.copie = true;
                setTimeout(() => {
                    this.copie = false;
                }, 8000);
            }
        }
    }
}
</script>

<style scoped>
input {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
}
</style>