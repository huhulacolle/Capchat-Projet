<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand disable-select">GESTION DE CAPTCHAS</a>
                <div class="align-self-end" id="navbarNavAltMarkup">
                    <div class="navbar-nav ml-auto">
                        <a class="nav-link" data-bs-toggle="modal" data-bs-target="#connexion">Connexion</a>
                        <a class="nav-link" data-bs-toggle="modal" data-bs-target="#inscription">Inscription</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Inscription -->
        <div class="modal fade" id="inscription" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <form @submit.prevent="inscription()">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Inscription</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Surnom</label>
                                <input type="text" v-model="surnomInscription" class="form-control" required
                                    :disabled="inscriptionBool">
                                <div class="form-text">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Mot de passe</label>
                                <input type="password" v-model="mdpInscription" class="form-control" required
                                    :disabled="inscriptionBool">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirmer le mot de passe</label>
                                <input type="password" v-model="mdpConfirmeInscription" class="form-control" required
                                    :disabled="inscriptionBool">
                            </div>
                        </div>
                        <div class="alert alert-danger" role="alert" v-if="errorBoolInscription">
                            {{errorMsg}}
                        </div>
                        <div class="modal-footer" v-if="!inscriptionBool">
                            <button type="submit" class="btn btn-primary">Inscription</button>
                            <br>
                        </div>
                        <div style="text-align: center;" v-else>
                            {{inscriptionMsg}}
                            <br>
                            <a style="cursor: pointer;" class="link-secondary" data-bs-dismiss="modal" aria-label="Close" @click="toAccount()">Cliquer ici pour accedez à votre compte</a>
                            <br><br><br>
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
                            <div class="alert alert-danger" role="alert" v-if="errorBoolConnexion">
                                {{errorMsg}}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" aria-label="Close" class="btn btn-primary">Connexion</button>
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
            inscriptionBool: false,
            inscriptionMsg: null,
            errorBoolConnexion: false,
            errorBoolInscription: false,
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
                    this.errorBoolConnexion = false;
                    this.$refs.Close.click();
                    localStorage.setItem('token', data.data.token)
                    this.$router.push('/MonCompte')
                }
            )
            .catch(
                err => {
                    this.errorMsg = err.response.data.message;
                    this.errorBoolConnexion = true;
                }
            )
        },
        inscription() {
            if (this.mdpInscription == this.mdpConfirmeInscription) {
                this.errorBoolInscription = false;
                axios.post('inscription', {
                    username: this.surnomInscription,
                    password: this.mdpInscription
                })
                .then(
                    data => {
                        this.inscriptionMsg = data.data.message
                        this.inscriptionBool = true;
                        this.errorBoolInscription = false;
                        localStorage.setItem('token', data.data.token)
                    }
                )
                .catch(
                    err => {
                        this.errorMsg = err.response.data.message;
                        this.errorBoolInscription = true;
                    }
                )

            }
            else {
                this.errorMsg = "dégage la"
                this.errorBoolInscription = true;
            }
        },
        toAccount() {
            this.$router.push('/MonCompte');
        }
    }
}
</script>
