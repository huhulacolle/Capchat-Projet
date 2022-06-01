<template>
    <div>
        <!-- <div class="mx-auto" style="width: 800px;">
            <div class="row g-2" v-for="capchat in capchats" :key="capchat.ordre">
                <div class="col-sm">
                    <div class="p-3 border bg-ligh">
                        salut
                    </div>
                </div>
            </div>
        </div> -->
        <section>
            <p>Et voici un paragraphe !</p>
        </section>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            idJeu: 23,
            capchats: null
        }
    },
    created() {
        this.getCapchat();
    },
    methods: {
        getCapchat() {
            axios.get(`Capchat/${this.idJeu}`)
                .then(
                    data => {
                        console.log(data.data);
                        this.capchats = data.data;
                    }

                )
                .catch(
                    err => {
                        console.error(err);
                    }
                )
        },
    }
}
</script>

<style scoped>
body {
  background: beige;
}

section {
  display: block;
  width: 400px;
  height: 160px;
  background: lightgray;
}

p {
  width: 50%;   /* == 400px * .5 = 200px */
  height: 25%;  /* == 160px * .25 = 40px */
  margin: 5%;   /* == 400px * .05 = 20px */
  padding: 5%;  /* == 400px * .05 = 20px */
  background: cyan;
}

</style>