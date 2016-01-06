export default function(selector) {

  const amount = document.querySelectorAll(selector).length;

  if (amount <= 0) {
    return document.createElement('aside');
  }

  switch (amount) {
    case 1:
      return document.querySelector(selector);
      break;
    default:
      return document.querySelectorAll(selector);
  }

}
