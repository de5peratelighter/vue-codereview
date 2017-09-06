<template>
  <md-card class="kn-content">
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
            <md-subheader class="kn-subheader">Useful links</md-subheader>
            {{ item.links }}
          </div>
          <div class="kn-toggle-more" @click="showMore = false">
            - less
          </div>
        </div>
      </md-card-content>
      <md-card-header class="kn-card-header">
        <md-chip v-for="(tag,index) in item.tags"
                 @edit="filter('tags', tag)"
                 md-editable
                 :class="isActive('tags',tag)?'kn-tag-active kn-chip':'kn-tag kn-chip'"
                 :key="index">
            {{ tag }}
        </md-chip>
        <md-chip v-for="(client,index) in item.clients"
                 @edit="filter('clients', client)"
                 md-editable class="kn-client"
                 :class="isActive('clients',client)?'kn-client-active kn-chip':'kn-client kn-chip'"
                 :key="index">
            {{ client }}
        </md-chip>
        <md-subheader class="kn-subheader">Added by {{ item.author }}  on {{ item.date | knConvertDate }}</md-subheader>
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
  watch: {
    item() {
      this.showMore = false;
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
      return value.length >= 300? (value.substring(0, 300)+'...') : value;
    }
  }
}
</script>
<style scoped>
.kn-content {
  width: 100%;
  margin: 5px 0;
}
#kn-content .kn-toggle-more {
    color: #2196f3;
    cursor: pointer;
}
#kn-content .kn-content-links .kn-subheader {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    margin-top: 15px;
    padding: 0;
    min-height: 30px;
}
#kn-content .kn-content-summary {
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 2px;
}
#kn-content .kn-content-description,
#kn-content .kn-content-full-description {
  padding-top: 5px;
  white-space: pre-line;
}
#kn-content .kn-card-header {
  padding: 5px;
  margin-bottom: 0;
}
#kn-content .kn-card-header .kn-subheader {
  float: right;
  text-transform: uppercase;
  font-size: 13px;
}
#kn-tab .kn-chip {
  margin: 1px 2px;
}
#kn-tab .kn-chip.kn-tag {
  color: #2196f3;
}
#kn-tab .kn-chip.kn-client {
  color: #f44336;
}
#kn-tab .kn-chip.kn-tag:hover,
#kn-tab .kn-chip.kn-tag:focus,
#kn-tab .kn-chip.kn-tag-active {
  background-color: #2196f3;
  color: white;
}
#kn-tab .kn-chip.kn-client:hover,
#kn-tab .kn-chip.kn-client:focus,
#kn-tab .kn-chip.kn-client-active {
  background-color: #f44336;
  color: white;
}
</style>