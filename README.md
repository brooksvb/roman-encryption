# roman-encryption
A web API for a custom encryption scheme. The encryption method is loosely based upon the principle behind reading Roman numerals. The API is capable of encrypting a number into an array of large numbers with a user-defined threshold. The API can then intake the array, along with the original threshold, to decrypt and return the original number.

The API service is live at roman-encryption.herokuapp.com. 

# Encryption
Send a POST request to roman-encryption.herokuapp.com/encrypt. Body data should be in the format of "form-data."
Parameters:
- number : Value to be encrypted
- threshold : Threshold to use in encryption; needed in order to decrypt.
- size (optional) : Length of desired encrypted array. Default value is 50.

# Decryption
Send a POST request to roman-encryption.herokuapp.com/decrypt. Body data should be in the format of "form-data."
Parameters:
- array : Array of the encrypted number. (Parsed using JSON.parse(). Send as a string in the format of [1, 5, 3, 8]. Spaces are negligible.)
- threshold : Threshold used in encryption.
