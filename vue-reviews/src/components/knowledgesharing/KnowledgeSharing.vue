<template>
  <md-layout>
    <md-layout md-vertical-align="start" v-if="!activeUserGetter.isAnonymous" id="kn-tab">
      <kn-header :items="items"
                 :filters="filters"
                 @kn-item-submitted="updateData"
                 @kn-filter-removed="(data) => {updateFilter(data,'remove')}"
                 @kn-filters-cleared="(data) => {updateFilter(data,'removeAll')}"
                 @kn-search-filtered="(data) => {updateFilter(data,'add')}"
                 @kn-search-applied="(value) => {search = value}"
                 @kn-sorted-newest="(isNewestFirst) => {sortNewestFirst = isNewestFirst}"
                 @kn-filtered-date="(date) => {dateFilter = date} ">
      </kn-header>
      <kn-content :items="filteredItems"
                  :filters="filters"
                  :allowEdit="isEditable"
                  @kn-item-updated="updateData"
                  @kn-filter-applied="(data) => {updateFilter(data,'add')}">
      </kn-content>
    </md-layout>
    <md-layout v-else>
      Please log in to see the data!
    </md-layout>
  </md-layout>
</template>
<script>
  import firebase from 'firebase';
  import {mapActions, mapGetters} from 'vuex';
  import {FBApp} from '@/data/firebase-config';
  import knHeader from './KnowledgeSharingHeader'
  import knContent from './KnowledgeSharingContent.vue'
  import { levelMixin } from '@/mixins/restrictions'

  export default{
    components: {knHeader, knContent},
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
    mixins: [levelMixin],
    computed: {
      ...mapGetters(['activeUserGetter', 'firebasePathGetter']),
      isEditable() {
          return this.levelDEVORPM(this.activeUserGetter.role)||(this.activeUserGetter.notes?this.activeUserGetter.notes.toLowerCase() === 'knowledge sharing':false);
      },
      filteredItems() {
        return this.items.filter((item) => {
          if (this.isSearchMatched(item) && this.isDateMatched(item)) {
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
          if (this.sortNewestFirst) {
            return !this.isNextItemDateAfter(a, b) ? 1 : -1;
          }
          return this.isNextItemDateAfter(a, b) ? 1 : -1;
        });
      }
    },
    methods: {
      readData(){
        this.items = [];
        this.$bindAsArray('data', FBApp.ref(this.firebasePathGetter.knowledgesharing), null, () => {
          this.data.forEach((el) => {
            el.date = parseInt(el['.key']);
            this.items.push(el);
          });
        });
      },
      updateData(item){
        switch (item.action) {
          case 'update':
            delete item.data['.key'];
            delete item.data['date'];
            FBApp.ref(this.firebasePathGetter.knowledgesharing + '/' + item.key).set(item.data);
            break;
          case 'delete':
            FBApp.ref(this.firebasePathGetter.knowledgesharing + '/' + item.key).remove();
            break;
          case 'add':
            FBApp.ref(this.firebasePathGetter.knowledgesharing + '/' + this.$moment().valueOf()).set(item.data);
            break;
        }
        this.readData();
      },
      updateFilter(data, action){
          switch (action) {
            case 'add':
              if (this.filters.filter(filter => (filter.type === data.type && filter.value === data.value)).length === 0) {
                this.filters.push(data);
              }
              break;
            case 'remove':
              this.filters.splice(data, 1);
              break;
            case 'removeAll':
              this.filters = [];
              break;
          }
      },
      isSearchMatched(item) {
        return item.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1 || item.description.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
      },
      isDateMatched(item){
        if (this.dateFilter !== 'all') {
          return this.$moment(item.date).isAfter(this.$moment().startOf(this.dateFilter), 'day');
        }
        return true;
      },
      isNextItemDateAfter(a, b){
        return this.$moment(a.date).isAfter(this.$moment(b.date), 'day');
      }
    },
    activated() {
      console.log(this.activeUserGetter.isAnonymous);
      if (!this.activeUserGetter.isAnonymous) {
        this.readData();
      }
    },
    watch: {
      activeUserGetter (newValue) {
        if (!newValue.isAnonymous) {
          this.readData();
        }
      }
    }
  }
</script>
<style scoped>
</style>
