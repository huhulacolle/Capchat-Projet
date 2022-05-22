<template>
    <div>
        <div class="container">
            <form @submit.prevent="upload()">
                <input type="file" id="file">
                <input type="submit" class="btn btn-primary">
            </form>
            <br>
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
        upload() {
            var formData = new FormData();
            const test = document.getElementById('file')
            formData.append("img", test.files[0]);
            axios.post('testsendimg', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(
                () => {
                    this.getImg();
                }
            )
            .catch(
                err => {
                    console.error(err);
                }
            )
        },
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