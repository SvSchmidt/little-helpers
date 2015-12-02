var getLocalStorageLimit = function() {
    return interpolateLimit();
}

var interpolateLimit = function(step, startAt, endAt) {
    startAt = startAt || 0;
    step = step || 100000;
    endAt = endAt || 10000000;

    var max = 10000000;

    localStorage.clear();

    for (var i = startAt; i < endAt; i += step) {
        try {
            localStorage.setItem('test', 'a'.repeat(i));
        } catch(e) {
            if(step <= 1) {
                max = i;
            } else {
                max = interpolateLimit(step / 10, i - step, i);
            }
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
