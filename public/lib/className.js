// Browser version
function addClass(el, newClass) {
    if(el.className.indexOf(newClass) !== -1) {
      return;
    }
  
    if(el.className !== '') {
      //class names separated by a space
      newClass = ' ' + newClass;
    }
  
    el.className += newClass;
  }
  
  // Node Version
  module.exports = {
  addClass: function(el, newClass) {
  if(el.className.indexOf(newClass) !== -1) {
   return;
    }
  
  if(el.className !== '') {
   newClass = ' ' + newClass;
  }
  
  el.className += newClass;
  }
  }
  