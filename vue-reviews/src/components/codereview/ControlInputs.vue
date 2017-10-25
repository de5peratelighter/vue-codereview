<template>
  <md-layout md-align="end" :md-column="isColumn">
    
    <md-layout md-flex="30" :class="{ hidden: hiddenInputs.search && hiddenBydefault}">
      <md-input-container>
        <label v-if="isColumn">Search for ticket</label>
        <md-input v-model="search" @keyup.enter.native="findChanges(search)"></md-input>
        <md-button class="md-icon-button" @click="findChanges(search)">
          <md-icon>update</md-icon>
          <md-tooltip md-delay="300" md-direction="bottom"> {{helperTexts.clicker}} </md-tooltip>
        </md-button>
      </md-input-container>
    </md-layout>

    <md-layout md-flex="10" v-if="!isColumn">
      <md-button class="md-icon-button"  @click="showElement('search')">
        <md-tooltip md-delay="300" md-direction="bottom"> {{helperTexts.finder}} </md-tooltip>
        <md-icon>search</md-icon>
      </md-button>
    </md-layout>

    <md-layout md-flex="25" :class="{ hidden: hiddenInputs.displayNum && hiddenBydefault}">
      <md-input-container>
        <label v-if="isColumn">Number of instances</label>
        <md-input v-model="displayNum" @keyup.enter.native="updateItemsNum"></md-input>
        <md-button class="md-icon-button" @click="updateItemsNum">
          <md-icon>update</md-icon>
          <md-tooltip md-delay="300" md-direction="bottom"> {{helperTexts.clicker}} </md-tooltip>
        </md-button>
      </md-input-container>
    </md-layout>

    <md-layout md-flex="10" v-if="!isColumn">
      <md-button class="md-icon-button" @click="showElement('displayNum')">
        <md-tooltip md-delay="300" md-direction="bottom"> {{helperTexts.numbers}} </md-tooltip>
        <md-icon>filter_list</md-icon>
      </md-button>
    </md-layout>

  </md-layout>
</template>
<script>
    import firebase from 'firebase'
    import { FBApp } from '@/data/firebase-config'
    import {UPDATE_NUM, GET_FBASE} from '@/data/mutation-types'
    import { levelMixin } from '@/mixins/restrictions'
    import { toolbarLabelMixin } from '@/mixins/labels'
    import {mapActions, mapGetters} from 'vuex'
    export default {
        name: "ControlInputs",
        props : ['isColumn', 'hiddenBydefault'],
        data () {
            return {
                hiddenInputs : {
                    search : true,
                    displayNum : true
                },
                displayNum : this.$store.state.displayNum,
                search: this.$store.state.search.term,
            }
        },
        firebase : {},
        mixins: [levelMixin, toolbarLabelMixin],
        computed: {
            ...mapGetters(['firebasePathGetter'])
        },
        methods : {
            ...mapActions([UPDATE_NUM,GET_FBASE]),
            showElement (el) {
              this.hiddenInputs[el] = !this.hiddenInputs[el]
            },
            updateItemsNum () {
              this[UPDATE_NUM](this.displayNum)
            },
            findChanges (ticket) {
              if (ticket){
                this.$bindAsArray('allItems', FBApp.ref(this.firebasePathGetter.main), null, () => {
                    let changes = Object.values(this.allItems).filter((el)=> el.ticket.toLowerCase().includes(ticket.toLowerCase()))
                    this[GET_FBASE](changes)
                    this.$store.commit('eventSearchActive', true)
                })
              }
            },
        }
    }
</script>
