export const newInstanceMixin = {
  data () {
    return {
        pre : 'newInstance',
        codeReviewInputs : [
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
              maxLength: 70
          }, {
              id : this.pre + 'Comment',
              label: 'New Comment(optional)',
              val: '',
              required : false,
              maxLength : 100
          }
        ],
        mainConfigInputs : [
          {
              id : this.pre + 'Token',
              label : 'Token',
              val: '',
              required: true,
              maxLength : 70
          },
          {
              id : this.pre + 'Alias',
              label : 'Alias',
              val: '',
              required: true,
              maxLength : 70
          }
        ]
    }
      
  }
};