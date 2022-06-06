<template>
    <div>
        <div class="container">
            <ul class="list-group" v-for="artiste in artistes" :key="artiste">
                <li class="list-group-item"> {{artiste.nom}} </li>
            </ul>
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
        }
    }
}
</script>