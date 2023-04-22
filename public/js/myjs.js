function mydate() {
  const date = new Date();
  const currentDate = date.toDateString();
  document.getElementById("currentdate").innerHTML = currentDate;
}
