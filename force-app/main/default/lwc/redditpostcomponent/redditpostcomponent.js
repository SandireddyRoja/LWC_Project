import { LightningElement,api,track,wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { CurrentPageReference } from 'lightning/navigation';
import fetchposts from '@salesforce/apex/redditcomponentcontroller.fetchposts';
import postupvote from '@salesforce/apex/redditcomponentcontroller.postupvote';
import postdownvote from '@salesforce/apex/redditcomponentcontroller.postdownvote';
import createcomment from '@salesforce/apex/commentscontroller.fetchposts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import { NavigationMixin } from 'lightning/navigation';

export default class Redditpostcomponent extends NavigationMixin(LightningElement) {
    @track isModalOpen = false; //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    wiredresult;
    @track postlist;
    searchkey = '';
    textarea;
    
    currentPageReference = null; 
    urlStateParameters = null;
 
    /* Params from Url */
    subredditid = null;
   // calling page refrence to get record id from url
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
       if (currentPageReference) {
          this.urlStateParameters = currentPageReference.state;
          this.setParametersBasedOnUrl();
       }
    }
 
    setParametersBasedOnUrl() {
       this.subredditid = this.urlStateParameters.c__record || null;
      
    }
    //Calling fetchposts method on load 
     @wire(fetchposts,{Subredditid :'$subredditid',searchkey : '$searchkey'})
    wireddata(wireResult) {
        const { data, error } = wireResult;
        this.wiredresult = wireResult;
         if (data) {
            this.postlist = data;
            this.error = undefined;
        } else if (error) {
           // this.error = error;
            this.postlist = undefined;
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
        this.isModalOpen = false;
        refreshApex(this.wiredresult); //after creting the post it will refresh the list
    }
     handleupvote(event){
          // After clicked on upvote we are calling postupvote apex method
        const postid = event.target.dataset.name;
        postupvote({postid : postid})
         .then((result) => {
             refreshApex(this.wiredresult);
         })
          .catch((error) => {
               console.log('error-->'+error);  
            });

    }
      handledownvote(event){
       // After clicked on downvote we are calling postdownvote apex method
        console.log('-->'+event.target.dataset.name);
        const postid = event.target.dataset.name;
        postdownvote({postid : postid})
         .then((result) => {
             refreshApex(this.wiredresult);
         })
          .catch((error) => {
               console.log('error-->'+error);  
            });

    }
     handleChange(event){
                 //when users types in search this function will call
         this.searchkey = event.detail.value;
        refreshApex(this.wiredresult);
    }
    handlecommentclick(event){
        //to create a comment calling createcomment apex method
        const postid = event.target.dataset.name;
         createcomment({postid:postid, comments :this.textarea})
        .then((result) => {
              console.log('success-->');    
             const event = new ShowToastEvent({
                    message: 'Successfully Comment Created',
                    variant: 'success'
                });
                this.dispatchEvent(event);
                
         })
          .catch((error) => {
              console.log('error-->');  
            });

    }
    handleviewclick(event){
        // when clicked on the record this fuction will call redditcommentcomponent compoent and passed record id
         const postid = event.target.dataset.name;
         console.log('postid-->'+postid)
         this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: "c__redditcommentcomponent"
                },
            state: {
             c__record: postid //This is the name of the LWC to which we want to navigate
    }
        });
    
    }
    handletextChange(event){
        //when users try to type in comment data will fetch
        this.textarea = event.detail.value;
        console.log('test->'+this.textarea);

    }
}