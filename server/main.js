

import '../imports/api/tasks.js';
import '../imports/api/seiten.js';

import { Meteor } from 'meteor/meteor';
 
import { Config } from '../imports/api/config.js';
import { Tasks } from '../imports/api/tasks.js';
import { Seiten } from '../imports/api/seiten.js';

Meteor.startup(() => {
  // code to run on server at startup
   // var status_list= ["a","b","c","d","e"];
    
     Meteor.methods({

        "removeSeite": function(seiten_id) {
            Seiten.remove(seiten_id);
            Tasks.remove({"seiten_id":seiten_id});
        },
         
        "deleteAll": function() {
            Seiten.remove({});
            Tasks.remove({});
            Config.remove({});
            Config.insert({
                  name: "layout_breaks",
                  value: 7,
                });

            
        }


    });
});


