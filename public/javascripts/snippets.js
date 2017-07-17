(function(){
  document.querySelectorAll(".button.delete").forEach(e=>{
    e.addEventListener("click", ev=>{
      deleteSnippet(ev.target.dataset.id);
    });
  });

  function deleteSnippet(id){
    window.fetch(`/users/snippets/${id}`, {
      method: 'delete',
      credentials: 'include'
    })
      .then(res => {
        return window.location.replace(res.url);
      }); 
  } 
}());
