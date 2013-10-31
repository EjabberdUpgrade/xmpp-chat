Chat.Models.Message = Ember.Object.extend({
    from: null,
    to: null,
    body: null,
    id: null,
    createdAt: null,

    threadId: function(min, max){
    	return Math.floor(Math.random() * (max - min + 1) + min);
    },
    init: function () {
    	//if(this.id === null)
    		this.set('id', this.threadId(1,9999));
        this.set('createdAt', new Date());
    }
});
