var getRandomValues = require('get-random-values'); // npm package to give crypto random numbers

module.exports = {
  /**
    @param number: number to be encrypted
    @param threshold: threshold to be used in encryption
    @param size: size of desired return array
  */
  encrypt: function (number, threshold, size) {
    var array = [];
    var last, next, total;


    // For the length of the desired array
    for (var i = 0; i < size; i++) {

      // First item will be random
      if (i === 0) {

        array.push(this.getrand());
        last = array[0];
        total = array[0];

        // Last item will correct for any offset
      } else if (i === size - 1) {

        var offset = number - total;
        if (offset <= last + threshold) {
          next = offset;
        } else {
          next = offset + (2 * last);
        }
        array.push(next);

        // In order to ensure that the last item can correct for any offset in any case,
        // the second-to-last item must meet a certain condition
      } else if (i === size - 2) {

        do {
          next = this.getrand();
        } while (next + threshold < threshold + 1)

        array.push(next);
        if (last < next && next - last > threshold) {
          total -= 2 * last;
        }
        total += next;
        last = next;

        // Simply fill in the middle of the array with random numbers
      } else {

        next = this.getrand();
        if (last < next && next - last > threshold) {
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
    @param threshold: threshold that was used in encryption
  */
  decrypt: function (numbers, threshold) {
    var last, curr, total;
    last = numbers[0];
    total = numbers[0];
    for (var i = 1; i < numbers.length; i++) {
      curr = numbers[i];
      if (curr > last && curr - last > threshold) {
        total -= 2 * last;
      }
      total += curr;
      last = curr;
    }
    return total;
  },

  /**
    @param places: size of number
  */
  getrand: function (places) {
    var array = new Uint8Array(10);
    getRandomValues(array);
    var ret = array[0];
    for (var i = 1; i < array.length; i++) {
      ret *= array[i];
    }
    ret = this.shiftnum(ret, 10);
    ret *= this.posOrNeg();
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
    while (num > Math.pow(10, places) - 1) {
      num /= 10;
    }
    num = Math.floor(num);
    return num;
  },

  /**
    @description: has a 50/50 chance of either returning -1 or 1
  */
  posOrNeg: function () {
    var ret = (Math.random() < .5) ? 1 : -1;
    return ret;
  }
};
