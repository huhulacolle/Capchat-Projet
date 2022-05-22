<template>
    <div>
        <div class="container">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">img</th>
                        <th scope="col">format</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="img in imgs" :key="img.id">
                        <td>
                            {{img.id}}
                        </td>
                        <td>
                            <img :src="'data:' + img.format + ';base64, ' + img.img" />
                        </td>
                        <td>
                            {{img.format}}
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
                    console.log(data.data);
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