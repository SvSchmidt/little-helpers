var getLocalStorageLimit = function() {
    localStorage.clear();
    var max = 0;

    for (var i = 0; i < 10000000; i += 100000) {
        try {
            localStorage.setItem('test', 'a'.repeat(i));
        } catch(e) {
            max = i - 100000;
            break;
        }
    }

    localStorage.clear();
    return max;
}

var getLocalStorageUsage = function() {
    var total = 0;
    for(var x in localStorage) {
        var amount = (localStorage[x].length * 2);
        total += amount;
        console.log( x + " = " + (amount / 1024 / 1024).toFixed(10));
    }
    
    return total;
}

var testLocalStorage = function() {
    var usage = getLocalStorageUsage();
    var capacity = getLocalStorageLimit();

    console.info('localStorage Capacity: ' + (capacity / 1024 / 1024).toFixed(10) + 'MB');
    console.info('localStorage Usage: ' + (usage / 1024 / 1024).toFixed(10) + 'MB');
    console.info('localStorage remaining: ' + ((capacity - usage) / 1024 / 1024).toFixed(10) + 'MB');
}
