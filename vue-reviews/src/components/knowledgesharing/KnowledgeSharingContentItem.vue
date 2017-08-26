<template>
  <md-card>
    <md-card-area>
      <md-card-content>
        <div class="kn-content-summary">
          {{item.title}}
        </div>
        <div v-if="!showMore" class="kn-content-description">
          {{item.description | knShort}}
          <div v-if="showMoreAvailable" class="kn-toggle-more" @click="showMore = true">
            + more
          </div>
        </div>
        <div v-if="showMore" class="kn-content-full-description">
          {{ item.description }}
          <div v-if="item.links" class="kn-content-links">
            <md-subheader>Useful links</md-subheader>
            {{ item.links }}
          </div>
          <div class="kn-toggle-more" @click="showMore = false">
            - less
          </div>
        </div>
      </md-card-content>
      <md-card-header>
        <md-chip v-for="(tag,index) in item.tags"
                 @edit="filter('tags', tag)"
                 md-editable
                 :class="isActive('tags',tag)?'kn-tag-active':'kn-tag'"
                 :key="index">
            {{ tag }}
        </md-chip>
        <md-chip v-for="(client,index) in item.clients"
                 @edit="filter('clients', client)"
                 md-editable class="kn-client"
                 :class="isActive('clients',client)?'kn-client-active':'kn-client'"
                 :key="index">
            {{ client }}
        </md-chip>
        <md-subheader>Added by {{ item.author }}  on {{ item.date | knConvertDate }}</md-subheader>
      </md-card-header>
    </md-card-area>
  </md-card>
</template>
<script>
export default{
  props: ['item', 'filters'],
  data() {
    return {
      showMore: false,
      showMoreCharsNubmer: 300
    }
  },
  computed: {
    showMoreAvailable() {
      if(!this.item.links && this.item.description.length < this.showMoreCharsNubmer){
        return false;
      }
      return true;
    }
  },
  methods: {
    filter(type, value){
      this.$emit('kn-filter-applied', {
        type: type,
        value: value
      });
    },
    isActive(type, value){
      return this.filters.filter(filter => {
        if(filter.type === type && filter.value === value){
          return true;
        }
        return false;
      }).length > 0;
    }
  },
  filters: {
    knConvertDate(value) {
      return value.substring(0, value.indexOf(',') !== -1 ? value.indexOf(',') : value.length);
    },
    knShort(value) {
      return value.length >= 300? (value.substring(0, 400)+'...') : value;
    }
  }
}
</script>
<style>
#kn-content .md-card {
  width: 100%;
  margin: 5px 0;
}
#kn-content .kn-toggle-more {
    color: #2196f3;
    cursor: pointer;
}
#kn-content .kn-content-links .md-subheader {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    margin-top: 15px;
    padding: 0;
    min-height: 30px;
}
#kn-content .md-card .kn-content-summary {
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 2px;
}
#kn-content .md-card .kn-content-description,
#kn-content .md-card .kn-content-full-description {
  padding-top: 5px;
  white-space: pre-line;
}
#kn-content .md-card-header {
  padding: 5px;
  margin-bottom: 0;
}
#kn-content .md-card-header .md-subheader {
  float: right;
  text-transform: uppercase;
  font-size: 13px;
}
#kn-tab .md-chip.kn-tag {
  color: #2196f3;
}
#kn-tab .md-chip.kn-client {
  color: #f44336;
}
#kn-tab .md-chip.kn-tag:hover,
#kn-tab .md-chip.kn-tag:focus,
#kn-tab .md-chip.kn-tag-active {
  background-color: #2196f3;
  color: white;
}
#kn-tab .md-chip.kn-client:hover,
#kn-tab .md-chip.kn-client:focus,
#kn-tab .md-chip.kn-client-active {
  background-color: #f44336;
  color: white;
}
</style>
