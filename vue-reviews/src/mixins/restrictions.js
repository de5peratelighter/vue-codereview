export const levelMixin = {
    data () {
        return {
            roleOptions : [
                { id: 2, name: 'Engineer'},
                { id: 3, name: 'Reviewer'},
                { id: 4, name: 'TeamLead'},
                { id: 5, name: 'PM_DEV'},
            ],
            defaultRoleOption: 'Engineer',
            teamOptions : [
                { id: 1, name: 'NA1'},
                { id: 2, name: 'NA2'},
                { id: 3, name: 'EMEA'},
                { id: 4, name: 'Managers'},
                { id: 5, name: 'Newcomer'}
            ],
            defaultTeamOption : 'Newcomer'
        }
    },
    methods: {
        levelReviewer(role) {
            return role === 'Reviewer' || role === 'PM_DEV'
        },
        levelEngineer (role) {
            return role === 'Engineer' || role === 'Reviewer' || role === 'PM_DEV'
        },
        levelDEVORPM(role) {
            return role === 'PM_DEV'
        }
    }
};