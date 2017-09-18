<template>
    <div>
        <span class="md-headline">Review Schedule, {{formattedDate}}</span>
        <md-button class="md-icon-button md-accent" @click="dec"><md-icon>remove_circle</md-icon></md-button>
        <md-button class="md-icon-button md-accent" @click="inc"><md-icon>add_circle</md-icon></md-button>
    </div>
</template>

<script>
    import {SET_MONTH, SET_YEAR} from '@/data/mutation-types'
    import {mapActions, mapGetters } from 'vuex'
    export default {
        methods : {
            ...mapActions([SET_MONTH, SET_YEAR]),
            dec () {
                if (this.month === 1) {
                    this[SET_MONTH](12)
                    this[SET_YEAR](this.year - 1)
                } else {
                    this[SET_MONTH](this.month - 1)
                }
                this.$store.commit('eventFormActive', false)
            },
            inc () {
                if (this.month === 12) {
                    this[SET_MONTH](1)
                    this[SET_YEAR](this.year + 1)
                } else {
                    this[SET_MONTH](this.month + 1)
                }
            }
        },
        computed : {
            formattedDate () {
                return this.$moment(`${this.year}-${this.month}-1`, 'YYYY-M-D').format('MMMM YYYY')
            },
            month () {
                return this.$store.state.currentMonth
            },
            year () {
                return this.$store.state.currentYear
            },
        }
    }
</script>
<style scoped>
    div {
        display: flex;
        align-items: center;
    }
</style>