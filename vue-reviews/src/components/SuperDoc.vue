<template>
    <div class="c-main-section">
        SuperDoc
    </div>
</template>

<script>
    import firebase from 'firebase'
    import { levelMixin } from '@/mixins/restrictions'
    import { FBApp } from '@/data/firebase-config'
    import {mapActions, mapGetters } from 'vuex'
    export default {
        name: 'SuperDoc',
        firebase: {},
        mixins: [levelMixin],
        computed : {
            ...mapGetters(['activeUserGetter', 'firebasePathGetter'])
        },
    }
</script>