

import '../imports/api/tasks.js';
import '../imports/api/seiten.js';

import { Meteor } from 'meteor/meteor';

import { Tasks } from '../imports/api/tasks.js';
import { Tickets } from '../imports/api/tickets.js';
import { Seiten } from '../imports/api/seiten.js';
import { Ausgaben } from '../imports/api/ausgaben.js';

Meteor.startup(() => {
     Meteor.methods({

        "removeSeite": async function(seiten_id) {
            await Seiten.removeAsync(seiten_id);
            await Tasks.removeAsync({"seiten_id":seiten_id});
        },
         

        "removeAusgabe": async function(ausgaben_id) {
            await Seiten.removeAsync({"ausgaben_id":ausgaben_id});
            await Tasks.removeAsync({"ausgaben_id":ausgaben_id});
            await Ausgaben.removeAsync(ausgaben_id);
        },
         
         
        "deleteAll": async function() {
            await Seiten.removeAsync({});
            await Ausgaben.removeAsync({});
            await Tasks.removeAsync({});
        },
        "deleteSeiten": async function(ausgaben_id) {
           await Seiten.removeAsync({"ausgaben_id":ausgaben_id});
           await Tasks.removeAsync({"ausgaben_id":ausgaben_id});
        }


    });
});


