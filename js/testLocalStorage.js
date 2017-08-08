console.table = console.table || console.info;

function getStorageLimit (storage) {
  const rememberedData = {};

  // Remember stored data
  Object.keys(storage).forEach(k => {
    rememberedData[k] = storage[k];
  });

  storage.clear();

  /* The idea is the following:
   * try to store a very long string (10000000 bytes), and catch errors,
   * then try again with 10000000 / 10 etc. until no error is thrown
   */
  function interpolateLimit (step, startAt, endAt) {
      startAt = startAt || 0;
      step = step || 100000;
      endAt = endAt || 10000000;

      let max = 10000000;

      storage.clear();

      for (let i = startAt; i < endAt; i += step) {
          try {
              storage.setItem('test', 'a'.repeat(i));
          } catch (e) {
              if (step <= 1) {
                  max = i;
              } else {
                  max = interpolateLimit(step / 10, i - step, i);
              }
              
              break;
          }
      }
      
      return max;
  }

  const result = interpolateLimit();

  storage.clear();

  // Restore data to storage
  Object.keys(rememberedData).forEach(k => {
    storage[k] = rememberedData[k];
    delete rememberedData[k];
  });
  
  return result;
}

function getStorageUsage (storage) {
    let total = 0;
    let table = [];
    
    Object.keys(storage).forEach(k => {
        const amount = (storage[k].length /* length of actual data */ 
                        + k.length /* length of the key also taking storage*/)
                          * 2 /* ECMAScript defines strings as array of 16 bit 
                                 unicode; hence * 2 for number of regular 8 bit bytes */
        
        total += amount;
        table.push({ k, amount: MiB(amount, 10) });
    });

    console.table(table);
    
    return total;
}

function testStorage (storage) {
    const usage = getStorageUsage(storage);
    const capacity = getStorageLimit(storage);

    console.info('Capacity: ' + MiB(capacity) + ' MiB');
    console.info('Usage: ' + MiB(usage) + ' MiB');
    console.info('Remaining: ' + MiB(capacity - usage) + ' MiB');
}

function MiB (bytes, dec = 2) {
  return (bytes / 1024 / 1024).toFixed(dec);
}
