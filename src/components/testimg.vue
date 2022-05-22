<template>
    <div>
        <div class="container">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">img</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="img in imgs" :key="img.id">
                        <td>
                            {{img.id}}
                        </td>
                        <td>
                            <img :src="'data:image/jpg;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='"
                                alt="Red dot" />
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
    data(){
        return {
            imgs: null
        }
    },
    created() {
        this.getImg();
    },
    methods: {
        getImg() {
            axios.get('testgetimg')
            .then(
                data => {
                    this.imgs = data.data;
                }
            )
            .catch(
                err => {
                    console.error(err);
                }
            )
        }
    }
}
</script>