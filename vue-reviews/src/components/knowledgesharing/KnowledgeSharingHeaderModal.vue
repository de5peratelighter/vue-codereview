<template>
  <div id="knowledge-modal">
    <md-dialog ref="kn-modal"
               id="kn-modal-window">
      <md-dialog-title>
        {{ item? "Update Item": "Add Item" }}
        <md-subheader v-if="!item" class="kn-subheader">{{ date }}</md-subheader>
      </md-dialog-title>
      <md-dialog-content class="kn-dialog-content">
        <md-input-container md-clearable :class="title?'':'md-input-invalid'">
          <label>Summary</label>
          <md-input v-model="title" required maxlength="100"></md-input>
        </md-input-container>
        <md-input-container md-clearable class="kn-description">
          <label>Description</label>
          <md-textarea class="kn-description" v-model="description"></md-textarea>
        </md-input-container>
        <md-input-container md-clearable>
          <label>Useful links</label>
          <md-textarea v-model="links"></md-textarea>
        </md-input-container>
        <md-chips v-model="tags" md-input-placeholder="Tags" class="md-warn" :class="tags.length?'':'md-input-invalid'">
          <span class="md-error">Add at least one tag</span>
        </md-chips>
        <md-chips v-model="clients" md-input-placeholder="Clients"></md-chips>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog">Cancel</md-button>
        <md-button class="md-raised md-primary" @click="submitForm" :disabled="title&&tags.length?false:true">
          {{ item ? "Update" : "Create" }}
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>

</template>
<script>
  import {mapActions, mapGetters} from 'vuex';
  export default {
    props: ['item'],
    computed: {
      ...mapGetters(['activeUserGetter'])
    },
    data(){
      return {
        date: this.$moment().format('dddd, DD MMM YY'),
        title: this.item&&this.item.title ? this.item.title : '',
        description: this.item&&this.item.description ? this.item.description : '',
        tags: this.item&&this.item.tags ? Array.from(this.item.tags) : [],
        clients: this.item&&this.item.clients ? Array.from(this.item.clients) : [],
        links: this.item&&this.item.links ? this.item.links : ''
      }
    },
    methods: {
      closeDialog() {
        this.$refs['kn-modal'].close();
        this.title = this.item&&this.item.title ? this.item.title : '';
        this.description = this.item&&this.item.description ? this.item.description : '';
        this.tags = this.item&&this.item.tags ? Array.from(this.item.tags) : [];
        this.clients = this.item&&this.item.clients ? Array.from(this.item.clients) : [];
        this.links = this.item&&this.item.links ? this.item.links : '';
      },
      submitForm() {
        this.$emit('kn-item-submitted', {
          title: this.title,
          description: this.description,
          tags: this.tags,
          clients: this.clients,
          author: this.item&&this.item.author?this.item.author:this.activeUserGetter.alias,
          links: this.links
        });
        this.closeDialog();
      }
    }
  }
</script>
<style scoped>
  #kn-modal-window .kn-dialog-content {
    width: 600px;
  }
  #kn-modal-window .kn-subheader {
    padding: 0;
    text-transform: uppercase;
    min-height: 30px;
  }
  #kn-modal-window .kn-description textarea {
    min-height: 125px;
  }
</style>
