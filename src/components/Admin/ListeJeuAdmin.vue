<template>
    <div>
        <transition enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut" mode="out-in">
            <div class="container" v-if="!dessin">
                <br>
                <div class="row">
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
                <!-- <Dessin :id=dessinComposent /> -->
            </div>
        </transition>

    </div>
</template>
<script>
import axios from 'axios'

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
    created() {
        this.getJeu();
    },
    methods: {
        getJeu() {
            axios.get('getJeu')
            .then(
                data => {
                    this.tabJeux = data.data
                }
            )
            .catch(
                err => {
                    console.error(err);
                }
            )
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