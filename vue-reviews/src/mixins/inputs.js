export const newInstanceMixin = {
  data () {
    return {
        codeReviewInputs : [
          {
              id : 'Changeset',
              label : 'New Changeset',
              val: '',
              required: true,
              maxLength : 250,
              tooltip: "Full Changeset URL"
          }, {
              id : 'Ticket',
              label: 'New Ticket',
              val: '',
              required: true,
              maxLength: 70,
              tooltip: "Full Ticket URL"
          }, {
              id : 'Comment',
              label: 'New Comment(optional)',
              val: '',
              required : false,
              maxLength : 250 ,
              tooltip: "Your comment to the changes"
          }
        ],
        mainConfigInputs : [
          {
              id : 'Token',
              label : 'Token',
              val: '',
              required: true,
              maxLength : 70,
              tooltip: "Unique user identifier in Firebase Console, this value is generated upon first user login and never changed. Please get it from Firebase consol >> Authentication section",
          },
          {
              id : 'Alias',
              label : 'Alias',
              val: '',
              required: true,
              maxLength : 70,
              tooltip: "User alias (display name aka 'aturkev' etc), please consider this value as it becomes user identifier for as humans",
          }
        ]
    }
      
  }
};