<template>
    <div>
        <NavBarUser :nom=nom />
        <br>
        <ul class="nav nav-pills justify-content-center">
            <li class="nav-item" v-for="menu in menus" :key="menu">
                <a class="nav-link" @click="changeMenu(menu)"
                    v-bind:class="{ 'active': menuSelect == menu }">{{menu}}</a>
            </li>
        </ul>
        <br>
        <div>
            <transition :enter-active-class="enter"
                :leave-active-class="leave" mode="out-in">
                <div v-if="menuSelect == 'ton Capchat'">
                    <Capchat />
                </div>
                <div v-else-if="menuSelect == 'T\'es dessins'">
                    <Dessin />
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import NavBarUser from '@/components/NavBarUser.vue'
import Capchat from '@/components/Capchat.vue'
import Dessin from '@/components/Dessin.vue'
import axios from 'axios'

export default {
    data() {
        return {
            enter: null,
            leave: null,
            nom: null,
            menus: [
                "ton Capchat",
                "T'es dessins",
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
        NavBarUser,
        Capchat,
        Dessin
    },
    methods: {
        user() {
            axios.get('compte', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(
                data => {
                    this.nom = data.data.content.username
                }
            )
            .catch(
                error => {
                    console.log(error);
                    this.$router.push('/')
                }
            )
        },
        changeMenu(select) {
            let oldMenuSelectIndex = this.menus.find(m => m == this.menuSelect)
            oldMenuSelectIndex = this.menus.indexOf(oldMenuSelectIndex);
            
            this.menuSelect = select
            this.animationConfig(oldMenuSelectIndex);
        },
        animationConfig(oldMenuSelectIndex) {
            let menu = this.menus.find(m => m == this.menuSelect)
            menu = this.menus.indexOf(menu);
            if (menu > oldMenuSelectIndex) {
                this.enter = "animate__animated animate__fadeInLeft"
                this.leave = "animate__animated animate__fadeOutRight"
            }
            else {
                this.enter = "animate__animated animate__fadeInRight"
                this.leave = "animate__animated animate__fadeOutLeft"
            }
        }
    }
}
</script>