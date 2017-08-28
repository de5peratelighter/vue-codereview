<template>
  <md-layout md-vertical-align="start" md-flex="100" id="kn-content">
    <md-layout v-for="(item,index) in items" md-flex="90" md-flex-offset="5" md-align="left" :key="index">
      <kn-content-item :item="item"
                       :filters="filters"
                       @kn-filter-applied="filter">
      </kn-content-item>
    </md-layout>
  </md-layout>
</template>
<script>
import knContentItem from './KnowledgeSharingContentItem.vue'
  export default {
    props: ['items', 'filters'],
    components: {knContentItem},
    methods: {
      filter(data){
        this.$emit('kn-filter-applied', data);
      }
    }
  }
</script>
<style scoped>
  #kn-content {
    margin-top: 10px;
  }
</style>
