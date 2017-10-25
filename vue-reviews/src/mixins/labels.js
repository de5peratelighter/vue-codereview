export const codereviewLabelMixin = {
    data () {
        return {
            initialMessage: "This is dummy data, please LOG IN to get the real one",
            noaccessMessage : "Your account is NOT ACTIVATED yet. \n PM will be activating accounts for Support Engineers, please stand by. \
                Upon account activation - this application will automatically pick up the changes.",
            welcomeMessage: "Welcome! You're free to add your own changes to the list. \
                This will trigger notification to the current reviewer, upon status update you will also receive notification (if subscribed).",
            ownerCommentMessage : "* Your comment will show/replace 'From Author' comment section",
            reviewerCommentMessage : "* Your comment will show/replace 'From Reviewer' comment section",
            snackbarMessage : '',
            helperTexts : {
                author : "Submitted",
                avatar : "Author's avatar",
                cset : "Changeset link",
                ticket : "Ticket link",
                comments : "Comments",
                status : "Reviewer and the status"
            }
        }
    }
};

export const toolbarLabelMixin = {
    data () {
        return {
            helperTexts : {
                numbers : "Number of items (SHIFT+F)",
                finder : "Search for a ticket (SHIFT+F)",
                clicker : "Click to update"
            }
        }
    }
};