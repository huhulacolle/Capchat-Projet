<template>
    <div>
        <div class="container">
            <table class="table">
                <tbody>
                    <tr>
                        <td>
                            <form @submit.prevent="setTheme()">
                                <input type="text" class="form-control" v-model="nom" placeholder="Nom" required>
                                
                                <input type="submit" class="card-link link-primary" value="">
                            </form>
                        </td>
                    </tr>
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
            nom: null
        }
    },
    created() {
        this.getTheme();
    },
    methods: {
        getTheme() {
            axios.get('theme')
                .then(
                    data => {
                        this.themes = data.data;
                    }
                )
        },
        setTheme() {
            axios.post('theme', {
                nom: this.nom
            })
            .then(
                () => {
                    this.getTheme();
                }
            )
            .catch(
                err => {
                    console.error(err);
                }
            )
        },
        modifier(id) {
            this.loadingDL = true;
            this.success = false;
            const value = document.getElementById(id).value;
            axios.put('theme', {
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
            axios.delete(`theme/${id}`)
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
.link-primary {
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    text-decoration: none;
}
.link-primary:hover {
    text-decoration: underline;
}
</style>