var Reflux = require('reflux');

var defaults = {
    preEmit: function (){
        //arguments[0] contains args object for each event
        //e.g. the args in addPointToPage(args)
    },
    shouldEmit: function (args) {
        return true;
    },
};

var Actions = Reflux.createActions({
    'filterMapByDate': {
        preEmit: defaults.preEmit,
        shouldEmit: defaults.shouldEmit
    },
});