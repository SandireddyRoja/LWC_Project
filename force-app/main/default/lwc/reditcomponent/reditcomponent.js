import { LightningElement,track ,wire} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

import fetchsubreddits from '@salesforce/apex/redditcomponentcontroller.fetchsubreddits';
import subredditupvote from '@salesforce/apex/redditcomponentcontroller.subredditupvote';
import subredditdownvote from '@salesforce/apex/redditcomponentcontroller.subredditdownvote';

export default class ModalPopupLWC extends NavigationMixin(LightningElement) {
    //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    @track isModalOpen = false;
    wiredresult;
    @track redditlist;
    searchkey = '';


    // on load we are getting all the Subrreddit records
    @wire(fetchsubreddits,{searchkey : '$searchkey'})
    wireddata(wireResult) {
        const { data, error } = wireResult;
        this.wiredresult = wireResult;
         if (data) {
            this.redditlist = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.record = undefined;
        }
    }
    
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    handleSuccess(){       
         refreshApex(this.wiredresult);
         this.isModalOpen = false;
}
    handleupvote(event){
        // After clicked on upvote we are calling subredditupvote apex method
        console.log('agendaEditId-->'+event.target.dataset.name);
        const subredditid = event.target.dataset.name;
        subredditupvote({Subreddit : subredditid})
         .then((result) => {
             refreshApex(this.wiredresult); //refreshing the list after upvote
         })
          .catch((error) => {
               console.log('error-->'+error);  
            });

    }
      handledownvote(event){
           // After clicked on downvote we are calling subredditdownvote apex method
        console.log('agendaEditId-->'+event.target.dataset.name);
        const subredditid = event.target.dataset.name;
        subredditdownvote({Subreddit : subredditid})
         .then((result) => {
           refreshApex(this.wiredresult); //refreshing the list after down votevote
         })
          .catch((error) => {
               console.log('error-->'+error);  
            });

    }
    handleclick(event){
        // when clicked on the record this fuction will call redditpostcomponentaura compoent and passed record id
       console.log('subredditid-->'+event.target.dataset.name); 
       const subreditid = event.target.dataset.name;
       this[NavigationMixin.Navigate]({  // calling aura component
            type: 'standard__component',
            attributes: {
                componentName: "c__redditpostcomponentaura"
                },
            state: {
             c__record: subreditid //This is the name of the LWC to which we want to navigate
    }
        });
    }
    handleChange(event){
        //when users types in search this function will call
         this.searchkey = event.detail.value;
        refreshApex(this.wiredresult); //refreshing the list after search
    }
}