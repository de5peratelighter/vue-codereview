export const newInstanceMixin = {
  data () {
    return {
        codeReviewInputs : [
          {
              id : 'Changeset',
              label : 'New Changeset',
              val: '',
              required: true,
              maxLength : 250
          }, {
              id : 'Ticket',
              label: 'New Ticket',
              val: '',
              required: true,
              maxLength: 70
          }, {
              id : 'Comment',
              label: 'New Comment(optional)',
              val: '',
              required : false,
              maxLength : 250
          }
        ],
        mainConfigInputs : [
          {
              id : 'Token',
              label : 'Token',
              val: '',
              required: true,
              maxLength : 70
          },
          {
              id : 'Alias',
              label : 'Alias',
              val: '',
              required: true,
              maxLength : 70
          }
        ]
    }
      
  }
};