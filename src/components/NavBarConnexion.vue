<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand">GESTION DE CAPTCHAS</a>
                <div class="align-self-end" id="navbarNavAltMarkup">
                    <div class="navbar-nav ml-auto">
                        <a class="nav-link" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#connexion">Connexion</a>
                        <a class="nav-link" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#inscription">Inscription</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Inscription -->
        <div class="modal fade" id="inscription" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <form>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Inscription</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Surnom</label>
                                <input type="text" v-model="surnomInscription" class="form-control" required>
                                <div class="form-text">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Mot de passe</label>
                                <input type="password" v-model="mdpInscription" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirmer le mot de passe</label>
                                <input type="password" v-model="mdpConfirmeInscription" class="form-control" required>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary">Inscription</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Connexion -->
        <div class="modal fade" id="connexion" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <form @submit.prevent="connexion()">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Connexion</h5>
                            <button type="button" class="btn-close" ref="Close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Surnom</label>
                                <input type="text" v-model="surnomConnexion" class="form-control" required>
                                <div class="form-text">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Mot de passe</label>
                                <input type="password" v-model="mdpConnexion" class="form-control" required>
                            </div>
                            <div class="alert alert-danger" role="alert" v-if="errorBool">
                                {{errorMsg}}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary">Connexion</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            errorBool: false,
            errorMsg: null,
            surnomInscription: null,
            mdpInscription: null,
            mdpConfirmeInscription: null,
            surnomConnexion: null,
            mdpConnexion: null,
            mdpConfirmeConnexion: null
        }
    },
    methods: {
        connexion() {
            axios.post('connexion', {
                username: this.surnomConnexion,
                password: this.mdpConnexion
            })
            .then(
                data => {
                    this.$refs.Close.click();
                    this.errorBool = false;
                    localStorage.setItem('token', data.data.token)
                    this.$router.push('/test')
                }
            )
            .catch(
                err => {
                    this.errorMsg = err.response.data.message;
                    this.errorBool = true;
                }
            )
        }
    }
}
</script>
