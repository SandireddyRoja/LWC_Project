import { LightningElement,api,track,wire } from 'lwc';

import CreateComments from '@salesforce/apex/commentscontroller.fetchchildcomments';
import { refreshApex } from '@salesforce/apex';
import handleupvotes from '@salesforce/apex/commentscontroller.commentupvote';
import handeledownvotes from '@salesforce/apex/commentscontroller.commentdownvote';
export default class Redditchildcomponents extends LightningElement {
    @api parentid;
    @track childcomments;
    @track wiredResult;
    error;

    // on load getting all the child records of the parent records
    @wire(CreateComments,{Parentid : '$parentid'})
    comentfiles(result){
        this.wiredResult=result;
        if(result.data){
            this.childcomments=result.data;
            this.error=undefined;
        }else if(result.error){
            this.error=result.error;
            this.records=undefined;
        }
    }
    @api handlechange(){
        //it will invoked in the parent component to reresh the list
        console.log('calling finction');
        refreshApex(this.wiredResult);
    }
     handleupvote(event){
// After clicked on upvote we are calling handleupvotes apex method
        const commentid = event.target.dataset.name;
        handleupvotes({commentid : commentid})
         .then((result) => {
              refreshApex(this.wiredResult);
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
              refreshApex(this.wiredResult);
         })
        
          .catch((error) => {
               console.log('error-->'+error);  
            });

    }
        

}