<template>
    <span>
        {{submittedFromDate(date)}}
    </span>
</template>
<script>
    export default {
        name: "ShowReviewdate",
        props : ['date'],
        methods : {
            submittedFromDate (el) {
                
              el = this.$moment(el, 'DD-MM-YYYY, hh:mm:ss')
              
              if ((el).isSame(this.$moment(), 'day')) {
                return 'Today'
              } else if ((el).isSame(this.$moment().add(-1,'days'), 'day')) {
                return 'Yesterday'
              } else if ((el).isSame(this.$moment(), 'week')) {
                return 'This week'
              } else if ((el).isSame(this.$moment().add(-1,'weeks'), 'week')) {
                return 'Last week'
              } else if ((el).isSame(this.$moment(), 'month')) {
                return 'This month'
              } else if ((el).isSame(this.$moment().add(-1,'months'), 'month')) {
                return 'Last month'
              } else if ((el).isSame(this.$moment(), 'year')) {
                return 'This year'
              } else {
                return 'Unknown date'
              }
            }
        }
    }
</script>