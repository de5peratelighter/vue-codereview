<template>
  <md-input-container class="status-input">
    <label for="status" style="color:inherit">{{ item.reviewer ? item.reviewer : 'Codereviewer will set the status' }}</label>
    <md-select :disabled="cantChangeStatus(item.username)" name="status" v-model="item.status" class="width80" md-flex-offset="50">
      <md-option v-for="option in selectOptions" :key="option.id" :value="option.name" @selected="onStatusChange(item)">{{option.name}}</md-option>
    </md-select>
    <md-button :disabled="canRemoveInstance(item.username)" class="md-icon-button" @click="onRemoveInstance(item)">
      <md-icon style="color:inherit">delete_forever</md-icon>
    </md-button>
  </md-input-container>
</template>
<script>
    import {mapActions, mapGetters } from 'vuex'
    import { levelMixin } from '@/mixins/restrictions'
    export default {
        name: "UpdateStatus",
        props : ['item'],
        data () {
          return {
            selectOptions :  [
              { id: 1, name: 'New' },
              { id: 2, name: 'Looking' },
              { id: 3, name: 'Questions'},
              { id: 4, name: 'Good' },
              { id: 5, name: 'NotOK' }],
          }
        },
        computed: {
          ...mapGetters(['activeUserGetter'])
        },
        mixins: [levelMixin],
        methods : {
            onStatusChange (el) {
              this.$emit('statusUpdate', el)
            }, 
            onRemoveInstance (el) {
              this.$emit('removeInstance', el)
            },
            cantChangeStatus (name) {
              return !this.levelReviewer(this.activeUserGetter.role) || (this.activeUserGetter.alias === name)
            },
            canRemoveInstance (name) {
              return !(this.activeUserGetter.alias === name)
            }
        }
    }
</script>
<style scoped>
  .status-input {
    margin-bottom: 15px;
  }
</style>