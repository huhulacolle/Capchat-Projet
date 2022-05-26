<template>
    <div>
        <div class="container">
            <div class="row">
                <div class="col text-center">
                    <form @submit.prevent="sendingDessin()">
                        <div class="card text-center" style="width: 20rem;">
                            <svg id="svg" style="background-color:beige" />
                            <div class="card-body">
                                <input type="file" id="dessin"> Image Singulière
                                <input type="text" disabled>
                                <input type="submit" value="Envoyer" class="card-link" />
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col text-center" v-for="dessin in dessins" :key="dessin.id">
                    <div class="card text-center" style="width: 20rem;">
                        <img :src="'data:' + dessin.format + ';base64, ' + dessin.img" class="card-img-top" alt="...">
                        <div class="card-body text-center">
                            <div v-if="dessin.ImageSinguliere"> Image Singulière <br> {{dessin.TexteQuestion}} </div>
                            <a class="card-link link-danger">Supprimer</a>
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
    props: {
        id: null
    },
    data() {
        return {
            dessins: null
        }
    },
    created() {
        this.getDessin();
    },
    methods: {
        getDessin() {
            axios.get(`getDessin/${this.id}`)
            .then(
                data => {
                    this.dessins = data.data
                    console.log(data.data);
                }
            )
            .catch(
                err => {
                    console.error(err);
                }
            )
        },
        sendingDessin() {
            let formData = new FormData();
            const dessin = document.getElementById('dessin')
            formData.append("dessin", dessin.files[0]);
            formData.append("texteQuestion", null);
            formData.append("imageSinguliere", 0);
            formData.append("idJeu", this.id);
            axios.post('setDessin', formData, {
                'Content-Type': 'multipart/form-data'
            }
            )
            .then(
                () => {
                    this.getDessin();
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