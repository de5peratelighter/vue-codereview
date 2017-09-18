export const capacityRecordMixin = {
  methods: {
    skipUser(user) {
      if(user['team'] === 'Newcomer' || ['TeamLead', 'Engineer', 'Reviewer'].indexOf(user['role']) === -1) {
        return true
      }
    },
    createUserString(user) {
      if(this.skipUser(user)) {
        return;
      }
      const team = user['team'];
      return `,,,,|,,,,|,,,,||${team}`;
    }
  }
};