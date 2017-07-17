(function(){
  document.querySelectorAll(".button.delete").forEach(e=>{
    e.addEventListener("click", ev=>{
      alert(ev.target.parentElement.getAttribute("data-id"));
    });
  });





  
}());
