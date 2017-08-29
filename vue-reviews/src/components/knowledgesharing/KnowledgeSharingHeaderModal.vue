<template>
  <div id="knowledge-modal">
    <md-layout>
      <md-button class="md-raised md-primary" id="kn-add-item" @click="openModal">Add Item</md-button>
    </md-layout>
    <md-dialog md-open-from="kn-add-item" md-close-to="kn-add-item" ref="kn-add-item-modal"
               id="kn-modal-add-item">
      <md-dialog-title>
        Add Item
        <md-subheader class="kn-subheader">{{ date }}</md-subheader>
      </md-dialog-title>
      <md-dialog-content class="kn-dialog-content">
          <md-input-container md-clearable :class="title?'':'md-input-invalid'">
            <label>Summary</label>
            <md-input v-model="title" required maxlength="100"></md-input>
          </md-input-container>
          <md-input-container md-clearable>
            <label>Description</label>
            <md-textarea v-model="description"></md-textarea>
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
        <md-button class="md-raised md-primary" @click="submitForm" :disabled="title&&tags.length?false:true">Create</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>

</template>
<script>
  import {mapActions, mapGetters} from 'vuex';
  export default {
    prop: ['ref', 'el'],
    computed: {
      ...mapGetters(['activeUserGetter'])
    },
    data(){
      return {
        title: '',
        description: '',
        tags: [],
        clients: [],
        links: '',
        date: this.$moment().format('dddd, DD MMM YY')
      }
    },
    methods: {
      openModal(){
        this.$refs['kn-add-item-modal'].open();
      },
      closeDialog() {
        this.$refs['kn-add-item-modal'].close();
        this.title = '';
        this.description = '';
        this.tags = [];
        this.clients = [];
        this.links = '';
      },
      submitForm() {
        console.log(this.activeUserGetter);
        this.$emit('kn-item-submitted', {
          title: this.title,
          description: this.description,
          tags: this.tags,
          clients: this.clients,
          author: this.activeUserGetter.alias,
          links: this.links,
          date: this.$moment().format('DD-MM-YYYY, HH:mm:ss')
        });
        this.closeDialog();
      }
    }
  }
</script>
<style scoped>
  #kn-modal-add-item .kn-dialog-content {
    width: 600px;
  }
  #kn-modal-add-item .kn-subheader {
    padding: 0;
    text-transform: uppercase;
    min-height: 30px;
  }
</style>
