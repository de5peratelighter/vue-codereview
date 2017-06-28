<template>
    <md-card>
        <md-layout>
            <md-layout v-for="(item, index) in inputs" :key="index">
                <md-input-container>
                    <label :for="item.id">{{item.label}}</label>
                    <md-input :id="item.id" v-model="item.val" :required="item.required" :maxlength="item.maxLength"></md-input>
                </md-input-container>
            </md-layout>
            <md-layout md-flex="15">
                <md-button class="md-raised md-accent" :disabled="disableSubmit" @click="submitData">Submit</md-button>
                <md-button class="md-raised" :disabled="!disableSubmit" @click="clearData">Clear</md-button>
            </md-layout>
        </md-layout>
    </md-card>
</template>

<script>
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
                        maxLength: 30
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
            disableSubmit () {
                return this.inputsInvalid
            }
        },
        watch: {
            inputs : {
                handler(after, before) {
                    let stater = after.every((el) => {
                        return (el.required && !el.val.includes(this.requiredWord)) ? false : true
                    })
                    this.inputsInvalid = stater ? false : true
                },
                deep: true
            },
            
          },
        methods : {
            submitData (el) {
                console.log('submit',el)
            },
            clearData (el) {
                console.log('clear',el)
            }
        }
        
    }
</script>