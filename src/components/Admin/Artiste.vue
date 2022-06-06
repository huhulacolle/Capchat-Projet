<template>
    <div>
        <div class="container">
            <table class="table">
                <tbody>
                    <tr v-for="artiste in artistes" :key="artiste">
                        <td>
                            {{artiste.nom}}
                        </td>
                        <td>
                            <a @click="deleteArtiste(artiste.id)" class="card-link link-danger">Supprimer</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            artistes: null
        }
    },
    created() {
        this.getArtistes();
    },
    methods: {
        getArtistes() {
            axios.get('getArtistes')
            .then(
                data => {
                    this.artistes = data.data
                }
            )
            .catch(
                err => {
                    console.error(err);
                }
            )
        },
        deleteArtiste(id) {
            axios.delete(`deleteArtiste/${id}`)
            .then(
                () => {
                    this.getArtistes();
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
a {
    text-decoration: none;
    cursor: pointer;
}

a:hover {
    text-decoration: underline;
}

</style>