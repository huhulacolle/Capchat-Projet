<template>
    <div>
        <NavBarConnexion />
        <div class="d-flex align-items-center justify-content-center" style="height: 500px;">
            <h1> {{typeValue}} </h1>
        </div>
    </div>
</template>
<script>
import NavBarConnexion from '@/components/NavBarConnexion.vue'

export default {
    components: {
        NavBarConnexion
    },
    data() {
        return {
            typeValue: '',
            typeStatus: false,
            typeArray: ['Capcha', 'Capchat'],
            typingSpeed: 100,
            erasingSpeed: 100,
            newTextDelay: 500,
            typeArrayIndex: 0,
            charIndex: 0,
            soustitre: false
        }
    },
    created() {
        if (localStorage.getItem('token')) {
            this.$router.push('/MonCompte')
        }
        setTimeout(this.typeText, this.newTextDelay + 200);
    },
    methods: {
        typeText() {
            if (this.typeValue != "Capchat") {
                if (this.charIndex < this.typeArray[this.typeArrayIndex].length) {
                    if (!this.typeStatus)
                        this.typeStatus = true;
                    this.typeValue += this.typeArray[this.typeArrayIndex].charAt(this.charIndex);
                    this.charIndex += 1;
                    setTimeout(this.typeText, this.typingSpeed);
                } else {
                    this.typeStatus = false;
                    setTimeout(this.eraseText, this.newTextDelay);
                }
            } else {
                this.soustitre = 0;
                return 0;
            }
        },
        eraseText() {
            if (this.charIndex > 0) {
                if (!this.typeStatus)
                    this.typeStatus = true;
                this.typeValue = this.typeArray[this.typeArrayIndex].substring(0, this.charIndex - 1);
                this.charIndex -= 1;
                setTimeout(this.eraseText, this.erasingSpeed);
            } else {
                this.typeStatus = false;
                this.typeArrayIndex += 1;
                if (this.typeArrayIndex >= this.typeArray.length)
                    this.typeArrayIndex = 0;
                setTimeout(this.typeText, this.typingSpeed + 1000);
            }
        }
    },
}
</script>