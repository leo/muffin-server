export default function(name) {

  const query = window.location.search.substring(1),
        vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == name) {
      return pair[1];
    }
  }

  return(false);

}
