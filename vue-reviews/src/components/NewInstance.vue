<template>
    <md-layout class="c-main-section">
        <md-layout v-for="(item, index) in inputs" :key="index">
            <md-input-container>
                <label :for="item.id">{{item.label}}</label>
                <md-input :id="item.id" v-model="item.val" :required="item.required" :maxlength="item.maxLength"></md-input>
            </md-input-container>
        </md-layout>
        <md-layout md-flex="15">
            <md-button class="md-raised md-accent" :disabled="disableSubmit" @click="submitData">Submit</md-button>
            <md-button class="md-raised" @click="clearData">Clear</md-button>
        </md-layout>
    </md-layout>
</template>

<script>
    import firebase from 'firebase'
    import FBApp from './../data/firebase-config'
    var provider = new firebase.auth.GoogleAuthProvider();
    import {mapActions, mapGetters } from 'vuex'
    export default {
        data () {
            return {
                pre : 'newInstance',
                inputsInvalid : true,
                requiredWord : 'bazaarvoice',
                inputs : [
                    {
                        id : this.pre + 'Changeset',
                        label : 'New Changeset',
                        val: '',
                        required: true,
                        maxLength : 70
                    }, {
                        id : this.pre + 'Ticket',
                        label: 'New Ticket',
                        val: '',
                        required: true,
                        maxLength: 50
                    }, {
                        id : this.pre + 'Comment',
                        label: 'New Comment(optional)',
                        val: '',
                        required : false,
                        maxLength : 100
                    }
                ]
            }
        },
        computed : {
            ...mapGetters(['activeUserGetter', 'firebasePathGetter']),
            disableSubmit () {
                return this.inputsInvalid
            }
        },
        watch: {
            inputs : {
                handler(after, before) {
                    let stater = after.every((el) => (el.required && !el.val.includes(this.requiredWord)) ? false : true)
                    this.inputsInvalid = stater ? false : true
                },
                deep: true
            }
          },
        methods : {
            submitData (el) {
                // if user updated the disabled attribute manually in the markup - impress him by putting it back;)
                if (this.inputsInvalid) {
                    el.target.setAttribute('disabled', this.inputsInvalid)
                } else if (!this.activeUserGetter.isAnonymous) {
                    let newData = {
                        username: this.activeUserGetter.alias,
                        si:  this.activeUserGetter.photoURL,
                        content: this.inputs[0].val,
                        ticket: this.inputs[1].val,
                        status: 'New',
                        reviewer: '',
                        st : this.$moment().format('DD-MM-YYYY, hh:mm:ss')
                    } 
                    if (this.inputs[2].val) { newData.comment = this.inputs[2].val }
                    console.log(newData)
                    FBApp.ref(this.firebasePathGetter.main).push(newData)
                }
                
                this.clearData()
            },
            clearData (el) {
                this.inputs.map(el=> el.val = "")
            }
        }
        
    }
</script>
