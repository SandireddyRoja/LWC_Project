public class commentscontroller {
    // To create comments records based on the posts 
    @AuraEnabled
    public static List<Comments__c> fetchposts(Id postid, String comments){
        Comments__c comment = new Comments__c();
        comment.Posts__c = postid;
        comment.Name = comments;
        comment.Down_Vote__c = 0;
        comment.Up_Vote__c = 0;
        insert comment;
        System.debug('comment-->'+comment);
        List<Comments__c> commentslist= [Select id,Comment__c,Name,Posts__c,CreatedDate,Down_Vote__c,Up_Vote__c,Parent_Comment__c from Comments__c where Posts__c=:postid];
        return commentslist;
    }
    // to fetch the all comments based on the post
     @AuraEnabled(cacheable=true)
    public static List<Comments__c> fetchcomments(Id postid){
        List<Comments__c> commentslist= [Select id,Comment__c,Name,Posts__c,CreatedDate,Posts__r.Name,Down_Vote__c,Up_Vote__c,Parent_Comment__c from Comments__c where Posts__c=:postid];
       System.debug('commentslist-'+commentslist); 
        return commentslist;
        
    }
    // to fetch all child comments based on the parent comments
     @AuraEnabled(cacheable=true)
    public static List<Comments__c> fetchchildcomments(Id Parentid){
        List<Comments__c> commentslist= [Select id,Comment__c,Name,Posts__c,CreatedDate,Posts__r.Name,Down_Vote__c,Up_Vote__c,Parent_Comment__c from Comments__c where Parent_Comment__c =:Parentid];
       System.debug('parentcommentslist-'+commentslist.Size());  
        return commentslist;
        
    }
    // to fetch the post name based on the post 
	@AuraEnabled
    public static String postname(Id postid){
        Post__c postname = [Select id,Name from Post__c Where id =:postid];
         String name = postname.Name;
        return name;
    }
    // To create child commentsnbased on the parent id
      @AuraEnabled
    public static List<Comments__c> Createchildcomments(Id Postid, Id parentComment,String Comments){
        Comments__c comment = new Comments__c();
        //comment.Posts__c = postid;
        comment.Name = comments;
        comment.Down_Vote__c = 0;
        comment.Up_Vote__c = 0;
        comment.Parent_Comment__c = parentComment;
        insert comment;
        List<Comments__c> commentslist= [Select id,Comment__c,Name,Posts__c,CreatedDate,Down_Vote__c,Up_Vote__c,Parent_Comment__c from Comments__c where Posts__c=:Postid];
        return commentslist;
    }
    // This method will handle when user clicks on up vote 
     @AuraEnabled
    public static List<Comments__c> commentupvote(Id commentid){
        Comments__c Comment = [Select id,Comment__c,Name,Posts__c,CreatedDate,Down_Vote__c,Up_Vote__c,Parent_Comment__c from Comments__c Where Id =:commentid];
        Comment.Up_Vote__c = Comment.Up_Vote__c+1;
        if( Comment.Down_Vote__c !=0 && Comment.Down_Vote__c !=null){
        Comment.Down_Vote__c = Comment.Down_Vote__c-1;
    }
        update Comment;
        List<Comments__c> allcomments = [Select id,Comment__c,Name,Posts__c,CreatedDate,Down_Vote__c,Up_Vote__c,Parent_Comment__c from Comments__c where Posts__c =: Comment.Posts__c];
        return allcomments;
           
    }
     // This method will handle when user clicks on down vote 
     @AuraEnabled
    public static List<Comments__c> commentdownvote(Id commentid){
        Comments__c Comment = [Select id,Comment__c,Name,Posts__c,CreatedDate,Down_Vote__c,Up_Vote__c,Parent_Comment__c from Comments__c Where Id =:commentid];
        Comment.Down_Vote__c = Comment.Down_Vote__c+1;
        if( Comment.Up_Vote__c !=0 && Comment.Up_Vote__c !=null){
        Comment.Up_Vote__c = Comment.Up_Vote__c-1;
    }
        update Comment;
        List<Comments__c> allcomments = [Select id,Comment__c,Name,Posts__c,CreatedDate,Down_Vote__c,Up_Vote__c,Parent_Comment__c from Comments__c where Posts__c =: Comment.Posts__c];
        return allcomments;
           
    }

}