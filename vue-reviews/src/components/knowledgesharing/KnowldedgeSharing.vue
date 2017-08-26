<template>
  <md-layout md-vertical-align="start" v-if="!activeUserGetter.isAnonymous" id="kn-tab">
    <kn-header :items="items"
               :filters="filters"
               @kn-item-submitted="submitData"
               @kn-filter-removed="removeFilter"
               @kn-filters-cleared="removeAllFilters"
               @kn-search-filtered="addToFilter"
               @kn-search-applied="(value) => {search = value}"
               @kn-sorted-newest="(isNewestFirst) => {sortNewestFirst = isNewestFirst}"
               @kn-filtered-date="(date) => {dateFilter = date} ">
    </kn-header>
    <kn-content :items="filteredItems"
                :filters="filters"
                @kn-filter-applied="addToFilter">
    </kn-content>
  </md-layout>
  <md-layout v-else>
    Please log in to see the data!
  </md-layout>
</template>
<script>
  import firebase from 'firebase';
  import {mapActions, mapGetters} from 'vuex';
  import {FBApp} from '@/data/firebase-config';
  import MdLayout from "../../../node_modules/vue-material/src/components/mdLayout/mdLayout";
  import knHeader from './KnowledgeSharingHeader'
  import knContent from './KnowledgeSharingContent.vue'

  export default{
    components: {MdLayout, knHeader, knContent},
    name: 'KnowledgeSharing',
    data(){
      return {
        // {author: '', title: '', description: '', date: '', tags: [], clients: [], links: []}
        items: [],
        // {value: '', type: ''}
        filters: [],
        search: '',
        sortNewestFirst: true,
        dateFilter: 'all'
      }
    },
    computed: {
      ...mapGetters(['activeUserGetter', 'firebasePathGetter']),
      filteredItems() {
        return this.items.filter((item) => {
          if (this.isSearchMatched(item) && this.isDateMatched(item)){
            for (let index in this.filters) {
              let filter = this.filters[index];
              if (item[filter.type]) {
                if (item[filter.type].indexOf(filter.value) === -1) {
                  return false;
                }
              } else {
                return false;
              }
            }
            return true;
          }
        }).sort((a, b) => {
          if(this.sortNewestFirst){
            return !this.isNextItemDateAfter(a,b)?1:-1;
          }
          return this.isNextItemDateAfter(a,b)?1:-1;
        });
      }
    },
    methods: {
      readData(){
        this.$bindAsArray('data', FBApp.ref(this.firebasePathGetter.knowledgesharing), null, () => {
          this.items = this.data;
        });
      },
      submitData(data){
        FBApp.ref(this.firebasePathGetter.knowledgesharing).push(data);
        this.readData();
      },
      addToFilter(data){
        if (this.filters.filter(filter => (filter.type === data.type && filter.value === data.value)).length === 0) {
          this.filters.push(data);
        }
      },
      removeFilter(index){
        this.filters.splice(index, 1);
      },
      removeAllFilters() {
        this.filters = [];
      },
      isSearchMatched(item) {
        return item.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1 || item.description.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
      },
      isDateMatched(item){
        if(this.dateFilter !== 'all') {
          return this.$moment(item.date, 'DD-MM-YYYY, HH:mm:ss').isAfter(this.$moment().startOf(this.dateFilter), 'day');
        }
        return true;
      },
      isNextItemDateAfter(a, b){
        return this.$moment(a.date, 'DD-MM-YYYY, HH:mm:ss').isAfter(this.$moment(b.date, 'DD-MM-YYYY, HH:mm:ss'), 'day');
      }
    },
    created() {
      this.$bindAsArray('data', FBApp.ref(this.firebasePathGetter.knowledgesharing), null, () => {
        this.items = this.data;
      });
    }
  }
</script>
<style>
  #kn-tab .md-chip {
    margin: 1px 2px;
  }
</style>
