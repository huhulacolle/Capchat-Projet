<template>
    <div>
        <div class="container">
            <div class="text-center">
                <button class="btn btn-primary" @click="downloadDessin()">
                    Télécharger
                    <span v-if="loadingDL" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </button>
            </div>
            <br>
            <div class="row">
                <div class="col text-center">
                    <form @submit.prevent="sendingDessin()">
                        <div class="card text-center" style="width: 20rem;">
                            <svg id="svg" style="background-color:grey" />
                            <div class="card-body">
                                <div class="mb-3">
                                    <label for="formFileSm" class="form-label"></label>
                                    <input class="form-control form-control-sm" id="dessin" type="file">
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" @click="radio()" type="checkbox" v-model="imageSinguliereBool" id="flexCheckDefault">
                                    <label class="form-check-label" for="flexCheckDefault">
                                        Image Singulière
                                    </label>
                                    <br><br>
                                    <input type="text" v-model="indice" class="form-control" placeholder="Indice" v-bind="{'disabled': !imageSinguliereBool }">
                                </div>

                                <input type="submit" value="Envoyer" class="card-link link-primary" />
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col text-center" v-if="loading">
                    <div class="spinner-border text-primary spinner-vertical-align:" role="status" />
                </div>
                <div class="col text-center" v-for="dessin in dessins" :key="dessin.id">
                    <div class="card text-center" style="width: 20rem;">
                        <img :src="'data:' + dessin.format + ';base64, ' + dessin.img" class="card-img-top" alt="...">
                        <div class="card-body text-center">
                            <div v-if="dessin.ImageSinguliere"> <strong>Image Singulière</strong> <br> indice : {{dessin.TexteQuestion}} <br> </div>
                            <a @click="deleteDessin(dessin.id)" class="card-link link-danger">Supprimer</a>
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
            imageSinguliereBool: false,
            indice: null,
            dessins: null,
            loading: true,
            loadingDL: false
        }
    },
    created() {
        this.getDessin();
    },
    methods: {
        getDessin() {
            axios.get(`dessin/${this.id}`)
                .then(
                    data => {
                        this.loading = false;
                        this.dessins = data.data
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
            formData.append("texteQuestion", this.indice);
            formData.append("imageSinguliere", this.imageSinguliereBool ? 1 : 0);
            formData.append("idJeu", this.id);
            axios.post('dessin', formData, {
                    'Content-Type': 'multipart/form-data'
                })
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
        },
        deleteDessin(id) {
            axios.delete(`dessin/${id}`)
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
        },
        radio() {
            if (this.imageSinguliereBool) {
                this.indice = null;
            }
        },
        downloadDessin() {
            this.loadingDL = true;
            axios.get(`downloadDessin/${this.id}`, {
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/zip'
                    }
                })
                .then(
                    data => {
                        const url = window.URL.createObjectURL(new Blob([data.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'file.zip');
                        document.body.appendChild(link);
                        this.loadingDL = false;
                        link.click();
                    }
                )
                .catch(
                    err => {
                        console.error(err);
                        this.loadingDL = false
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