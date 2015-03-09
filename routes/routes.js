
exports.index = function(req, res){
  res.render('index', { title: 'Welcome to JSPlayground Todo' });
};

exports.about = function(req, res){
  res.render('index', { title: 'Something Else' });
};

var redis = require("redis"),
  client = redis.createClient();

exports.todo = function(req, res){
 var anid= req.query['id'];
 var oldText="";
  console.log("View id is =>"+anid);
  if(anid=="" || anid==undefined){
  anid="";
  oldText="";
  console.log("if null callBack id is =>"+anid+" And text is =>"+oldText);	

  callBackExe();
  }
  else{
   client.hget("Todo1",anid, function(err, obj) {
   oldText=obj;
   callBackExe();
   });
  }
  
  function callBackExe(){
  var todos = [];
   client.hgetall("Todo1", function(err, objs) {
    for(var k in objs) {
      var newTodo = {
        text: objs[k],
		id:k
      };
      todos.push(newTodo);
    }
console.log("callBack id is =>"+anid+" And text is =>"+oldText);	
    res.render('todo', {
      title: 'New Todo List',
      todos: todos,
	  anid:anid,
	  oldText:oldText
    });
  });
  }
 
};



exports.saveTodo = function(req, res) {
  var newTodo = {};
  newTodo.name = req.body['todo-text'];
  var anid= req.body['id'];
  if(anid=="" || anid==undefined){
   console.log("save / edit id is =>"+anid);
  var d = new Date();
  var n = d.getTime();
  newTodo.id = n;
  }
  else{
  newTodo.id = anid;
  }
 
  client.hset("Todo1", newTodo.id, newTodo.name);
  res.redirect("/todo");
};

exports.removeTodo = function(req, res) {
 var anid= req.query['id'];
  if(anid=="" || anid==undefined){  
  res.redirect("/todo");
  }
  else{  
  res.redirect("/todo");
   client.hdel("Todo1", anid);
  }

};
