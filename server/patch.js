const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {Todo} = require('./../model/todo.js')

const setPatchRoute = (app)=>{
    app.patch('/todos/:id',(req,res)=>{
        const{id} = req.params;
        if(!ObjectID.isValid(id)){
            return res.status(404).send();
        }

        const param = _.pick(req.body,['text','completed']);
        if(_.isBoolean(param.completed) && param.completed){
            param.completedAt = new Date().getTime();
        }else{
            param.completedAt = null;
        }
        Todo.findByIdAndUpdate(id,param,{new:true}).then(doc=>{
            if(!doc){
                return res.status(404).send();
            }

            res.send(doc);
        }).catch(e=>{
            res.status(400).send();
        })
    })
}

module.exports = {setPatchRoute};