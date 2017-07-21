<template>
  <div id="app">
      
      <md-toolbar>
        <div class="md-toolbar-container">
          <md-button class="md-icon-button" @click="$refs.sidenav.toggle()">
            <md-icon >menu</md-icon>
          </md-button>
      
          <span style="flex: 1;"></span>
      
          <md-layout md-align="end">
            
            <md-layout md-flex="55" :class="{ hidden: hiddenInputs.search }">
              <md-input-container md-inline>
                <label>Number of instances</label>
                <md-input v-model="search"></md-input>
              </md-input-container>
            </md-layout>
            
            <md-layout md-flex="10">
              <md-button class="md-icon-button"  @click="showElement('search')">
                <md-icon>search</md-icon>
              </md-button>
            </md-layout>
            
            <md-layout md-flex="25" :class="{ hidden: hiddenInputs.displayNum }">
              <md-input-container md-inline>
                <label>Number of instances</label>
                <md-input v-model="displayNum"></md-input>
                <md-button class="md-icon-button" @click="updateItemsNum(displayNum)">
                  <md-icon>update</md-icon>
                </md-button>
              </md-input-container>
            </md-layout>
            
            <md-layout md-flex="10">
              <md-button class="md-icon-button" @click="showElement('displayNum')">
                <md-icon>filter_list</md-icon>
              </md-button>
            </md-layout>
            
          </md-layout>

        </div>
      </md-toolbar>
      
      
      <md-sidenav class="md-left" ref="sidenav">
        
        <main-nav>
          
          <md-list-item v-for="item in routes" :key="item">
            <router-link :to="{name : item.name}" class="router__link">
              <md-icon>{{ item.icon }}</md-icon>  <span>{{ item.title }}</span>
            </router-link>
          </md-list-item>
          
        </main-nav>
        
      </md-sidenav>
      
      <keep-alive>
        <router-view class="c-full-height"></router-view>
      </keep-alive>
  </div>
</template>

<script>

import 'animate.css/animate.min.css'

import {UPDATE_NUM} from './data/mutation-types'
import {mapActions, mapGetters} from 'vuex'
import MainNav from './components/MainNav.vue'

export default {
  name: 'app',
  data () {
    return {
      routes: [
        { title: 'Home', icon: 'home', name: 'CodeReview'},
        { title: 'Reviewers', icon: 'people', name: 'ReviewersList' }
      ],
      hiddenInputs : {
        search : true,
        displayNum : true
      },
      displayNum : this.$store.state.displayNum,
      search: this.$store.state.searchTerm
    }
  },
  computed : {
    ...mapGetters(['activeUserGetter', 'displayNumGetter'])
  },
  methods: {
    ...mapActions([UPDATE_NUM]),
    showElement (el) {
        this.hiddenInputs[el] = !this.hiddenInputs[el]
    },
    updateItemsNum (el) {
      this[UPDATE_NUM](this.displayNum)
    }
  },
  mounted () {
  },
  components : {
    MainNav
  }
}
</script>

<style>

.review-welcome > * {
  width: 100%;
  margin: 5px 8px;
  text-align: center;
}
.asider {
  background-color: #3f51b5;
  color: rgba(255, 255, 255, .87);
}
.slide-fade-enter-active {
  transition: all .1s ease;
}
.slide-fade-leave-active {
  transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
 .slide-fade-leave-active  {
  opacity: 0;
}
.router__link {
  text-decoration: none;
}
.c-full-width {
  width: 100%;
}
.c-full-height {
  min-height: 100vh;
}
.c-main-section {
  margin: 0 auto;
  width: 95%;
}
</style>
