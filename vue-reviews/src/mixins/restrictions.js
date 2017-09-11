export const levelMixin = {
    methods: {
        levelReviewer(role) {
            return role === 'Reviewer' || role === 'PM_DEV'
        },
        levelEngineer (role) {
            return role === 'Engineer' || role === 'Reviewer' || role === 'PM_DEV'
        },
        levelGuest(role) {
            return role === 'Engineer' || role === 'Reviewer' || role === 'PM_DEV' || role === 'Guest'
        },
        levelDEVORPM(role) {
            return role === 'PM_DEV'
        }
    }
};

export const optionsMixin = {
    data () {
        return {
            roleOptions : [
                { id: 1, name: 'Guest'},
                { id: 2, name: 'Engineer'},
                { id: 3, name: 'Reviewer'},
                { id: 4, name: 'TeamLead'},
                { id: 5, name: 'PM_DEV'},
            ],
            defaultRoleOption: 'Guest',
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
    }
};