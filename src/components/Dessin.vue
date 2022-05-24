<template>
    <div>
        <div class="container">
            <div class="row">
                <div class="col text-center" v-for="data in tabJeux" :key="data">
                    <div class="card text-center" style="width: 20rem;">
                        <div class="card-body text-center">
                            <h5 class="card-header" style="background-color: white"> {{data.jeu}} </h5>
                            <br>
                            <p class="card-text">
                                Theme : {{data.theme}}
                            </p>
                            <a href="#" class="card-link">Selectionner</a>
                            <a href="#" @click="deleteJeu(data.id)" class="card-link link-danger">Supprimer</a>
                        </div>
                    </div>
                </div>
                <form @submit.prevent="setJeu()">
                    <div class="col text-center">
                        <div class="card text-center" style="width: 20rem;">
                            <div class="card-body text-center">
                                <h5 class="card-header" style="background-color: white">
                                    <input type="text" placeholder="Nom" v-model="jeuInput" class="form-control" required>
                                </h5>
                                <br>
                                <p class="card-text">
                                    Theme :
                                    <select v-model="theme" class="form-control" required>
                                        <option v-for="t in themeSelect" :key="t.id" :value=t.id>
                                            {{t.nom}}
                                        </option>
                                    </select>
                                </p>
                                <input type="submit" value="Crée le jeu" class="card-link link-primary"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            jeuInput: null,
            theme: null,
            themeSelect: null,
            tabJeux:null
        }
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
                        console.log(data);
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
                    theme: this.theme
                })
                .then(
                    () => {
                        console.log("jeu envoyer");
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
        deleteJeu(id) {
            console.log(id);
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
.card {
    margin: 0 auto;
    float: none;
    margin-bottom: 10px;
}

.card-link {
    text-decoration: none;
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