public class redditcomponentcontroller {
    // This Method helps to get all the subreddits to display in the system
   @AuraEnabled(cacheable=true)
    public static List<Sub_Reddit__c> fetchsubreddits(String searchkey){
        string query = 'Select Id, Name,Category__c,DownVote__c,Upvote__c from Sub_Reddit__c';
        if(searchkey != null && searchkey != ''){
              String key = '%' + searchkey + '%';
            query += ' WHERE Name Like :key ORDER BY Name ASC';
        }else{
            query += ' ORDER BY Name ASC';
        }
        //  return [Select Id, Name,Category__c,DownVote__c,Upvote__c from Sub_Reddit__c];
        System.debug('Database.query(query)->'+ Database.query(query));
        return Database.query(query); 
    }
    // This Methods helps to up vote subreddits
    @AuraEnabled
    public static List<Sub_Reddit__c> subredditupvote(Id Subreddit){
        Sub_Reddit__c subredditrecord = [Select Id, Name,Category__c,DownVote__c,Upvote__c from Sub_Reddit__c Where Id =:Subreddit];
        subredditrecord.Upvote__c = subredditrecord.Upvote__c+1;
        if( subredditrecord.DownVote__c !=0 && subredditrecord.DownVote__c !=null){
        subredditrecord.DownVote__c = subredditrecord.DownVote__c-1;
    }
        update subredditrecord;
        List<Sub_Reddit__c> allsubredits = [Select Id, Name,Category__c,DownVote__c,Upvote__c from Sub_Reddit__c ORDER BY Name ASC];
        return allsubredits;
           
    }
    // This Method helps to down vote the subreddits
     @AuraEnabled
    public static List<Sub_Reddit__c> subredditdownvote(Id Subreddit){
        Sub_Reddit__c subredditrecord = [Select Id, Name,Category__c,DownVote__c,Upvote__c from Sub_Reddit__c Where Id =:Subreddit];
        subredditrecord.DownVote__c = subredditrecord.DownVote__c+1;
        if( subredditrecord.Upvote__c !=0 && subredditrecord.Upvote__c !=null){
        subredditrecord.Upvote__c = subredditrecord.Upvote__c-1;
    }
        update subredditrecord;
       	List<Sub_Reddit__c> allsubredits = [Select Id, Name,Category__c,DownVote__c,Upvote__c from Sub_Reddit__c ORDER BY Name ASC];
        return allsubredits;
    }
    // This Method helps to fetch the posts using subreddtis
    @AuraEnabled(cacheable=true)
    public static List<Post__c> fetchposts(Id Subredditid, String searchkey){
        Sub_Reddit__c subid= [Select id,Name from Sub_Reddit__c Where Id=:Subredditid];
        List<Post__c> posts = new  List<Post__c>();
       if(searchkey != null && searchkey != ''){
              String key = '%' + searchkey + '%';
            posts = [Select Id, Name,Sub_Reddit__c,DownVote__c,Upvote__c from Post__c where Sub_Reddit__c=:Subredditid And Name Like:key];
        }else{
          posts = [Select Id, Name,Sub_Reddit__c,DownVote__c,Upvote__c from Post__c where Sub_Reddit__c=:Subredditid];
                   }
              return posts;
        
    }
    //This Method helps to up vote the posts
     @AuraEnabled
    public static List<Post__c> postupvote(Id postid){
        Post__c postrecord = [Select Id, Name,Sub_Reddit__c,DownVote__c,Upvote__c from Post__c Where Id =:postid];
        postrecord.Upvote__c = postrecord.Upvote__c+1;
        if( postrecord.DownVote__c !=0 && postrecord.DownVote__c !=null){
        postrecord.DownVote__c = postrecord.DownVote__c-1;
    }
        update postrecord;
        List<Post__c> allposts = [Select Id, Name,Sub_Reddit__c,DownVote__c,Upvote__c from Post__c where Sub_Reddit__c =: postrecord.Sub_Reddit__c];
        return allposts;
           
    }
    //This Method helps to down vote the posts
     @AuraEnabled
    public static List<Post__c> postdownvote(Id postid){
         Post__c postrecord = [Select Id, Name,Sub_Reddit__c,DownVote__c,Upvote__c from Post__c Where Id =:postid];
        postrecord.DownVote__c = postrecord.DownVote__c+1;
        if( postrecord.Upvote__c !=0 && postrecord.Upvote__c !=null){
        postrecord.Upvote__c = postrecord.Upvote__c-1;
    }
        update postrecord;
        List<Post__c> allposts = [Select Id, Name,Sub_Reddit__c,DownVote__c,Upvote__c from Post__c where Sub_Reddit__c =: postrecord.Sub_Reddit__c];
       
        return allposts;
    }
    // This Method helps to create comments in posts page
    @AuraEnabled
        public static List<Comments__c> CreateComment(id postid,String comments){
        System.debug('postid-->'+postid);
         System.debug('comments-->'+comments);
        Comments__c comment = new Comments__c();
        comment.Posts__c = postid;
        comment.Name = comments;
        comment.Down_Vote__c = 0;
        comment.Up_Vote__c = 0;
        insert comment;
        System.debug('comment-->'+comment);
        List<Comments__c> commentslist= [Select id, Name,Posts__c from Comments__c where Posts__c=:postid];
        return commentslist;
         }
    

}