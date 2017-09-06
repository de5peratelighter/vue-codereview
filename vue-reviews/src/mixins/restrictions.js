export const levelMixin = {
    data () {
        return {
            roleOptions : [
                { id: 1, name: 'Engineer'},
                { id: 2, name: 'Reviewer'},
                { id: 3, name: 'TeamLead'},
                { id: 4, name: 'PM_DEV'},
            ],
            defaultRoleOption: 'Engineer',
            teamOptions : [
                { id: 1, name: 'NA1'},
                { id: 2, name: 'NA2'},
                { id: 3, name: 'EMEA'},
                { id: 4, name: 'Managers'},
                { id: 5, name: 'Newcomer'}
            ],
            defaultTeamOption : 'Newcomer',
            tsetestingOptions : [
                { id: 1, name: 'Yes'},
                { id: 2, name: 'No'}
            ],
            defaulttestingOption : 'No',
            defaultSpecialNote : 'No'
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