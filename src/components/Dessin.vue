<template>
    <div>
        <div class="container">
            <form @submit.prevent="setJeu()">
                Nom
                <input type="text" v-model="nomJeu" class="form-control" required>
                Theme
                <select v-model="theme" class="form-control" required>
                    <option v-for="t in themeSelect" :key="t.id" :value=t.id>
                        {{t.nom}}
                    </option>
                </select>
                <br>
                <input type="submit" value="nouveau jeu" class="btn btn-primary"/>
            </form>
            <table class="table">
                <thead>
                    <th scope="col">
                        nom
                    </th>
                    <th scope="col"></th>
                </thead>
                <tbody>
                    
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
            nomJeu: null,
            theme: null,
            themeSelect: null
        }
    },
    created() {
        this.getTheme();
    },
    props: {
        id: null
    },
    methods: {
        getTheme() {
            axios.get('themes')
            .then(
                data => {
                    console.log(data.data);
                    this.themeSelect = data.data;
                }
            )
        },
        setJeu() {
            console.log(this.theme);
            this.nomJeu = null;
        }
    }
}
</script>