<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand">Bienvenue {{nom}}</a>
                <div class="align-self-end" id="navbarNavAltMarkup">
                    <div class="navbar-nav ml-auto">
                        <a class="nav-link" style="cursor: pointer;" @click="disconnect()" >Deconnexion</a>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
export default {
    props: {
        nom: null
    },
    methods: {
        disconnect() {
            localStorage.clear();
            this.$router.push('/');
        }
    }
}
</script>