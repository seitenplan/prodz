

import '../imports/api/tasks.js';
import '../imports/api/seiten.js';

import { Meteor } from 'meteor/meteor';
 
import { Config } from '../imports/api/config.js';
import { Tasks } from '../imports/api/tasks.js';
import { Seiten } from '../imports/api/seiten.js';
import { Ausgaben } from '../imports/api/ausgaben.js';

Meteor.startup(() => {
     Meteor.methods({

        "removeSeite": function(seiten_id) {
            Seiten.remove(seiten_id);
            Tasks.remove({"seiten_id":seiten_id});
        },
         

        "removeAusgabe": function(ausgaben_id) {
            Ausgaben.remove(ausgaben_id);
           Seiten.remove({"ausgaben_id":ausgaben_id});
           Tasks.remove({"ausgaben_id":ausgaben_id});
        },
         
         
        "deleteAll": function() {
            Seiten.remove({});
            Ausgaben.remove({});
            Tasks.remove({});
            Config.remove({});
        },
        "deleteSeiten": function(ausgaben_id) {
           Seiten.remove({"ausgaben_id":ausgaben_id});
           Tasks.remove({"ausgaben_id":ausgaben_id});
        }


    });
});


