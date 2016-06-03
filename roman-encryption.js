var getRandomValues = require('get-random-values'); // npm package to give crypto random numbers

module.exports = {
  /**
    @param number: number to be encrypted
    @param threshhold: threshhold to be used in encryption
    @param size: size of desired return array
  */
  encrypt: function (number, threshhold, size) {
    var array = [];
    var last, next, total;

    for (var i = 0; i < size; i++) {

      if (i === 0) {

        array.push(getrand());
        last = array[0];
        total = array[0];
        continue;

      } else if (i === size - 1) {

        var offset = number - total;
        if (offset <= last + threshhold) {
          next = offset;
        } else {
          next = offset + last;
        }
        array.push(next);

      } else {

        next = getrand();
        if (last < next && next - last > threshhold) {
          total -= 2 * last;
        }
        total += next;
        array.push(next);
        last = next;
      }
    }

    return array;
  },

  /**
    @param numbers: array of encoded number
    @param threshhold: threshhold that was used in encryption
  */
  decrypt: function (numbers, threshhold) {
    var last, curr, total;
    last = numbers[0];
    total = numbers[0];
    for (var i = 1; i < numbers.size; i++) {
      curr = numbers[i];
      if (last < curr && next - last > threshhold) {
        total -= 2 * last;
      }
      total += curr;
    }
    return total;
  },

  /**
    @param places: size of number
  */
  getrand: function (places) {
    var array = new Uint32Array(20);
    window.crypto.getRandomValues(array);

    var ret = array[0];
    for (var i = 1; i < array.size; i++) {
      ret *= array[i];
    }

    ret = shiftnum(ret, 10);
    return ret;
  },

  /**
    @description: shiftnum takes a number and shifts the decimal place to the right until
    the number has a desired amount of places. The returned number is also truncated.
    If the given number has less places than the desired places, it will be truncated
    and returned without any shifting.
    @param num: number to be shifted
    @param places: number of desired places in number
  */
  shiftnum: function (num, places) {
    while (num > 10 * (places + 1) - 1) {
      num /= 10;
    }
    Math.floor(num);
    return num;
  }
};
