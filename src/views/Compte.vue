<template>
    <div>
        <NavBarUser :nom=nom />
        <br>
        <ul v-if="!admin" class="nav nav-pills justify-content-center">
            <li class="nav-item" v-for="menu in menus" :key="menu">
                <a class="nav-link" @click="changeMenu(menu)"
                    v-bind:class="{ 'active': menuSelect == menu }">{{menu}}</a>
            </li>
        </ul>
        <ul v-if="admin" class="nav nav-pills justify-content-center">
            <li class="nav-item" v-for="menu in menusAdmin" :key="menu">
                <a class="nav-link" @click="changeMenu(menu)"
                    v-bind:class="{ 'active': menuSelect == menu }">{{menu}}</a>
            </li>
        </ul>
        <br>
        <div v-if="!admin">
            <transition :enter-active-class="enter" :leave-active-class="leave" mode="out-in">
                <div v-if="menuSelect == 'ton Capchat'">
                    <Home />
                </div>
                <div v-else-if="menuSelect == 'Tes jeux / Dessins'">
                    <ListeJeu />
                </div>
            </transition>
        </div>
        <div v-else>
            <div v-if="menuSelect == 'Les jeux / Dessins'">
                <ListeJeuAdmin />
            </div>
            <div v-else-if="menuSelect == 'les Artistes'">
                <Artiste />
            </div>
        </div>
    </div>
</template>

<script>
import NavBarUser from '@/components/NavBarUser.vue'
import Home from '@/components/User/Home.vue'
import ListeJeu from '@/components/User/ListeJeu.vue'
import ListeJeuAdmin from '@/components/Admin/ListeJeuAdmin.vue'
import Artiste from '@/components/Admin/Artiste.vue'
import axios from 'axios'

export default {
    data() {
        return {
            enter: null,
            leave: null,
            id: null,
            nom: null,
            admin: null,
            menus: [
                "ton Capchat",
                "Tes jeux / Dessins",
            ],
            menusAdmin: [
                "Les jeux / Dessins",
                "les Artistes"
            ],
            menuSelect: null
        }
    },
    created() {
        this.menuSelect = this.menus[0]
        this.animationConfig();
        this.user();
    },
    components: {
        Home,
        NavBarUser,
        ListeJeu,
        ListeJeuAdmin,
        Artiste
    },
    methods: {
        user() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios.get('compte')
            .then(
                data => {
                    this.id = data.data.content.id;
                    this.nom = data.data.content.username
                    this.admin = data.data.content.admin
                    if (this.admin) {
                        this.menuSelect = this.menusAdmin[0];
                    }
                }
            )
            .catch(
                error => {
                    console.log(error);
                    localStorage.clear();
                    this.$router.push('/')
                }
            )
        },
        changeMenu(select) {
            let oldMenuSelectIndex = this.menus.find(m => m == this.menuSelect);
            oldMenuSelectIndex = this.menus.indexOf(oldMenuSelectIndex);
            this.menuSelect = select;
            this.animationConfig(oldMenuSelectIndex);
        },
        animationConfig(oldMenuSelectIndex) {
            let menu = this.menus.find(m => m == this.menuSelect)
            menu = this.menus.indexOf(menu);
            if (menu > oldMenuSelectIndex) {
                this.enter = "animate__animated animate__fadeInRight"
                this.leave = "animate__animated animate__fadeOutLeft"
            }
            else {
                this.enter = "animate__animated animate__fadeInLeft"
                this.leave = "animate__animated animate__fadeOutRight"
            }
        }
    }
}

</script>