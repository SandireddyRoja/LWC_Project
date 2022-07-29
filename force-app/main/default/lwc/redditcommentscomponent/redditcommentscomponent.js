import { LightningElement,api,track,wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import getcomments from '@salesforce/apex/commentscontroller.fetchcomments';
import getname from '@salesforce/apex/commentscontroller.postname';
import createcomment from '@salesforce/apex/commentscontroller.fetchposts';
import Createchildcomments from '@salesforce/apex/commentscontroller.Createchildcomments';
import CreateComments from '@salesforce/apex/redditcomponentcontroller.CreateComment';
import handleupvotes from '@salesforce/apex/commentscontroller.commentupvote';
import handeledownvotes from '@salesforce/apex/commentscontroller.commentdownvote';

import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
export default class Redditcommentscomponent extends NavigationMixin(LightningElement) {
    wiredresult;
    wiredresultname;
    @track comentslist;
    Postname;
    currentPageReference = null; 
    urlStateParameters = null;
    Showreply = true;
    @track chieldcommentlist;
    textarea;
    childtextarea;
 
    /* Params from Url */
    postid = null;
   // calling page refrence to get record id from url
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
       if (currentPageReference) {
          this.urlStateParameters = currentPageReference.state;
          this.setParametersBasedOnUrl();
       }
    }
  // call name post method from the apex controller
    setParametersBasedOnUrl() {
       this.postid = this.urlStateParameters.c__record || null;
        getname({postid:this.postid})
       .then((result) => {
              console.log('success-->'+result);  
              this.Postname = result;
        })
         .catch((error) => {
              console.log('error-->');  
            });

      
    }
    // on load showing all the comments based in the post id
     @wire(getcomments,{postid :'$postid'})
    wireddata(wireResult) {
        const { data, error } = wireResult;
        this.wiredresult = wireResult;
         if (data) {
            this.comentslist = data;
            this.error = undefined;
          //  this.Postname = this.comentslist[0].Posts__r.name
        } else if (error) {
           // this.error = error;
           console.log('erroringetcomm');
            this.comentslist = undefined;
        }

    }

     handlecommentclick(){
      // After clicking on save calling CreateComments apex method
        CreateComments({postid:this.postid, comments: this.textarea})
        .then((result) => {
              console.log('success-->');   
                 refreshApex(this.wiredresult);
               // this.Postname = this.comentslist[0].Posts__r.Name;
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
    handlereplycommentclick(event){
       // After clicking on reply to comment save calling Createchildcomments apex method
        const parentcomment = event.target.dataset.name;
        console.log(parentcomment);
         console.log('2-->'+this.childtextarea);
        Createchildcomments({Postid: this.postid, parentComment:parentcomment, Comments : this.childtextarea})
        .then((result) => {
              console.log('success-->');   
                 refreshApex(this.wiredresult);
                this.template.querySelector("c-redditchildcomponents").handlechange(); // calling child component function for refresh the result
                this.Showreply = true;
               // this.Postname = this.comentslist[0].Posts__r.Name;
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
     handleupvote(event){
        // After clicked on upvote we are calling handleupvotes apex method
        const commentid = event.target.dataset.name;
        handleupvotes({commentid : commentid})
         .then((result) => {
              refreshApex(this.wiredresult);
         })
          .catch((error) => {
               console.log('error-->'+error);  
            });

    }
      handledownvote(event){
        // After clicked on downvote we are calling handeledownvotes apex method
        const commentid = event.target.dataset.name;
        handeledownvotes({commentid : commentid})
         .then((result) => {
              refreshApex(this.wiredresult);
         })
        
          .catch((error) => {
               console.log('error-->'+error);  
            });

    }
    handlereplyclick(event){
      //reply field making as false to show comment section
        const commentid = event.target.dataset.name;
        this.Showreply = false;
    }
    handletextChange(event){
      // assing text varable
        this.textarea = event.detail.value;
        console.log('test->'+this.textarea);

    }
    handletextchildChange(event){
        // assing text varable
      this.childtextarea = event.detail.value;
        console.log('test->'+this.childtextarea);
    }
}