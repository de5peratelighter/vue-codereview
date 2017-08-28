<template>
  <md-layout md-vertical-align="center" md-align="center">
    <md-layout md-flex="50">
      <md-input-container>
        <md-icon class="md-default">
          search
        </md-icon>
        <label>Search</label>
        <md-autocomplete v-model="searchValue"
                         :fetch="searchAutocomplete"
                         @selected="searchSelected"
                         @input="searchInput">
        </md-autocomplete>
      </md-input-container>
    </md-layout>
    <md-layout md-flex="10" md-flex-offset="5">
      <md-input-container>
        <label for="date">
          Date
        </label>
        <md-select name="date" id="kn-date" v-model="date" @selected="dateSelected">
          <md-option value="week">This week</md-option>
          <md-option value="month">This month</md-option>
          <md-option value="year">This year</md-option>
          <md-option value="all">All time</md-option>
        </md-select>
      </md-input-container>
    </md-layout>
    <md-layout md-flex="10" md-flex-offset="5">
      <md-input-container>
        <label for="sort">
          Sort by
        </label>
        <md-select name="sort" id="kn-sort" v-model="sort" @change="sortSelected">
          <md-option value="newest">Newest first</md-option>
          <md-option value="oldest">Oldest first</md-option>
        </md-select>
      </md-input-container>
    </md-layout>
    <md-layout md-flex="5" md-flex-offset="5">
      <kn-header-modal @kn-item-submitted="submitItem"></kn-header-modal>
    </md-layout>
    <md-layout md-flex="90">
      <md-chip v-if="filters.length > 0" @edit="removeAllFilters" md-editable class="kn-chip">Remove all filters
      </md-chip>
      <md-chip v-for="(filter,index) in filters"
               @delete="removeFilter(index)"
               md-deletable
               :class="[filter.type === 'tags' ? 'md-primary kn-chip' : 'md-accent kn-chip']"
               :key="index">
        {{ filter.value }}
      </md-chip>
    </md-layout>
  </md-layout>
</template>
<script>
  import knHeaderModal from './KnowledgeSharingHeaderModal.vue'
  export default {
    components: {knHeaderModal},
    props: ['items', 'filters'],
    data(){
      return {
        searchValue: '',
        date: 'all',
        sort: 'newest'
      }
    },
    methods: {
      removeFilter(index){
        this.$emit('kn-filter-removed', index);
      },
      submitItem(data){
        this.$emit('kn-item-submitted', data);
      },
      removeAllFilters() {
        this.$emit('kn-filters-cleared');
      },
      searchAutocomplete(param) {
        return new Promise((resolve, reject) => {
          let result = [];
          this.items.forEach(item => {
            if (item.tags)
              result =  this.searchPropsInItem(result, item, 'tags', param.q);
            if (item.clients)
              result =  this.searchPropsInItem(result, item, 'clients', param.q);
          });
          resolve(result);
        });
      },
      searchPropsInItem(result, item, props, value) {
        item[props].forEach((prop) => {
          if (prop.toLowerCase().indexOf(value.toLowerCase()) !== -1)
            if (result.findIndex((item) => {
              return item.name ===  props + ': ' + prop;
            }) === -1)
              result.push({
                name: props + ': ' + prop
              });
        });
        return result;
      },
      searchSelected(selected){
        this.$emit('kn-search-filtered', {
          type: selected.name.substring(0, selected.name.indexOf(':')),
          value: selected.name.substring(selected.name.indexOf(':') + 2, selected.length)
        });
        this.$emit('kn-search-applied', '');
        this.searchValue = '';
      },
      searchInput(input){
        this.$emit('kn-search-applied', input);
      },
      dateSelected (value) {
        this.$emit('kn-filtered-date', value);
      },
      sortSelected (value) {
        if(value === 'newest'){
          this.$emit('kn-sorted-newest', true);
        } else {
          this.$emit('kn-sorted-newest', false);
        }
      }
    }
  }
</script>
<style scoped>
  .kn-chip {
    margin: 1px 2px;
  }
</style>
