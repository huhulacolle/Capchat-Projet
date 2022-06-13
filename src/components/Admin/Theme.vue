<template>
    <div>
        <div class="container">
            <table class="table">
                <tbody>
                    <tr v-for="theme in themes" :key="theme">
                        <td>
                            <input type="text" class="form-control" :id="theme.id" :value="theme.nom">
                        </td>
                        <td>
                            <a class="card-link link-primary" @click="modifier(theme.id)">
                                Modifier
                            </a>
                        </td>
                        <td>
                            <a class="card-link link-danger" @click="supprimer(theme.id)">Supprimer</a>
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
            themes: null,
        }
    },
    created() {
        this.getTheme();
    },
    methods: {
        getTheme() {
            axios.get('themes')
                .then(
                    data => {
                        this.themes = data.data;
                    }
                )
        },
        modifier(id) {
            this.loadingDL = true;
            this.success = false;
            const value = document.getElementById(id).value;
            axios.put('updateTheme', {
                id: id,
                nom: value
            })
            .then(
                () => {
                    alert("success")
                }
            )
            .catch(
                err => {
                    console.error(err);
                }
            )
        },
        supprimer(id) {
            axios.delete(`deleteTheme/${id}`)
            .then(
                () => {
                    this.getTheme();
                }
            )
            .catch(
                err => {
                    alert(err.request.response)
                }
            )
        }
    }
}
</script>

<style scoped>
a {
    cursor: pointer;
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
</style>