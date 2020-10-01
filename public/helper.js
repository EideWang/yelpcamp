function text_truncate(str, length){
  if(str.length > length){
    //trim the string to the maximum length
    var trimmedString = str.substring(0, length);

    //re-trim if we are in the middle of a word and 
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
  }
  return trimmedString
}

module.exports = {
	text_truncate:text_truncate
}