<template>
    <div>
        <div style="text-align: center">
            ici sera le menu du capchat qui permettra de récupérer le lien iframe
        </div>
        <button @click="getCapchat()">test</button>
        <center><canvas id="canvas" width="1000" height="1000"></canvas></center>
        <div v-for="capchat in capchats" :key="capchat.ordre">
            <img style="width: 400px; height: auto" :src="'data:' + capchat.format + ';base64, ' + capchat.img" />
            <div v-if="capchat.ImageSinguliere">
                {{ capchat.TexteQuestion }}
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            capchats: null,
            idJeu: 23
        }
    },
    created() {
        // this.getCapchat();
    },
    methods: {
        getCapchat() {
            axios.get(`Capchat/${this.idJeu}`)
            .then(
                data => {
                    console.log(data.data);
                    this.capchats = data.data;
                    this.drawCanvas();
                }
                
            )
            .catch(
                err => {
                    console.error(err);
                }
            )
        },
        drawCanvas() {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            var positionX = 0;
            var positionY = 0;
            var img;
            for (var i = 0; i < 9; i++) {
                img = new Image();
                img.src = 'data:' + this.capchats[i].format + ';base64, ' + this.capchats[i].img;
                img.onload = function () {
                    img.style.display = 'inline';
                };
                if (i % 3 == 0) {

                    positionX = 0;
                    positionY += 100;
                } else {
                    positionX += 100;
                }
                // console.log(img);
                ctx.drawImage(img, positionX, positionY, 100, 100);

            }
        }
    }
}
</script>
 

