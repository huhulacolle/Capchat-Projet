<template>
    <div>
        <transition enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut" mode="out-in">
            <div class="container" v-if="!dessin">
                <br>
                <div class="row">
                    <div class="col text-center">
                        <form @submit.prevent="setJeu()">
                            <div class="card text-center" style="width: 20rem;">
                                <div class="card-body text-center">
                                    <h5 class="card-header" style="background-color: white">
                                        <input type="text" placeholder="Nom" v-model="jeuInput" class="form-control"
                                            required>
                                    </h5>
                                    <br>
                                    <p class="card-text">
                                        <select class="form-control" id="theme" required>
                                                <option value="" disabled selected hidden>Theme</option>
                                            <option v-for="t in themeSelect" :key="t.id" :value=t.id>
                                                {{t.nom}}
                                            </option>
                                        </select>
                                    </p>
                                    <input type="submit" value="Crée le jeu" class="card-link link-primary" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="col text-center" v-for="data in tabJeux" :key="data">
                        <div class="card text-center" style="width: 20rem;">
                            <div class="card-body text-center">
                                <h5 class="card-header" style="background-color: white"> {{data.jeu}} </h5>
                                <br>
                                <p class="card-text">
                                    Theme : {{data.theme}}
                                </p>
                                <br>
                                <a @click="getDessinComponents(data.id, data.jeu)" class="card-link">Selectionner</a>
                                <a @click="deleteJeu(data.id)" class="card-link link-danger">Supprimer</a>    
                                <br><br>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container" v-else>
                <button @click="quitDessinComponents()" class="btn btn-dark">&laquo; Précédents</button>
                <h1 class="text-center"> {{dessinComposentNom}} </h1> 
                <br>
                <Dessin :id=dessinComposent />
            </div>
        </transition>

    </div>
</template>

<script>
import axios from 'axios'
import Dessin from '@/components/User/Dessin.vue'

export default {
    data() {
        return {
            jeuInput: null,
            themeSelect: null,
            tabJeux:null,
            dessin: false,
            dessinComposent: null,
            dessinComposentNom: null
        }
    },
    components: {
        Dessin
    },
    created() {
        this.getTheme();
        this.getJeu();
    },

    methods: {
        getTheme() {
            axios.get('themes')
                .then(
                    data => {
                        this.themeSelect = data.data;
                    }
                )
        },
        getJeu() {
            axios.get('getJeu')
                .then(
                    data => {
                        this.tabJeux = data.data;
                    }
                )
                .catch(
                    err => {
                        console.error(err.request);
                    }
                )

            this.jeuInput = null;
        },
        setJeu() {
            axios.post('sendJeu', {
                    nom: this.jeuInput,
                    theme: document.getElementById('theme').value
                })
                .then(
                    () => {
                        this.getJeu();
                    }
                )
                .catch(
                    err => {
                        console.error(err.request);
                    }
                )

            this.jeuInput = null;
        },
        // eslint-disable-next-line no-unused-vars
        getDessinComponents(id, nom) {
            this.dessinComposent = id;
            this.dessinComposentNom = nom
            this.dessin = true;
        },
        quitDessinComponents() {
            this.dessinComposent = null;
            this.dessinComposentNom = null;
            this.dessin = false;
        },
        deleteJeu(id) {
            axios.delete(`deleteJeu/${id}`)
            .then(
                () => {
                    this.getJeu();
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

<style scoped>

.animate__animated{
  --animate-duration: 0.5s;
}

.card {
    margin: 0 auto;
    float: none;
    margin-bottom: 10px;
}

.card-link {
    text-decoration: none;
    cursor: pointer;
}

.link-primary {
    padding: 0;
    border: none;
    background: none;
}

.card-link:hover {
    text-decoration: underline;
}

</style>