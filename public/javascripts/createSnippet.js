"use strict";

var CRUD = (function(){
  function createSnippet(title, language, document, tags){
    let bodyJSON = JSON.stringify({
      title: title,
      language: language,
      document: document,
      tags: tags
    });
    window.fetch("/users/snippets", {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: bodyJSON
    })
      .then(res => {
        if(res.ok){
          return window.location.replace(res.url);
        }
        throw new Error("There was an error with the response.");
      })
      .catch(err=>{
        console.log(err);
      });
  }
  
  return {
    createSnippet: createSnippet
  };
}());

var dropDown = (function(){
  function init(){
    let dd = document.querySelector("#lang_dropdown");
    dd.addEventListener("change", ev => {
      let language = dd.options[dd.selectedIndex].value;
      console.log(language);
      let editor = core.getEditor();
      editor.getSession().setMode(`ace/mode/${language}`);
    });
  }

  return {
    init: init
  };
}());

var saveButton = (function(){
  function init(){
    document.querySelector("#save_wrapper").addEventListener("click", ev => {
      if(ev.srcElement.classList.contains("disabled")){
        return false;
      }
      else{
        let title = window.document.querySelector("#title_input").value;
        let languageSelect = window.document.querySelector("#lang_dropdown");
        let language = languageSelect.options[languageSelect.selectedIndex].value;
        let document = core.getEditor().getValue();
        let tags = window.document.querySelector("#tags").value.split(",");
        tags.forEach((e,i,a) => {
          e.trim();
        });
        return CRUD.createSnippet(title, language, document, tags);
      }
    }); 
  }

  return {
    init: init
  };
}());

var inputListening = (function(){
  function init(){
    document.querySelector("#title_input").addEventListener("keyup", ev => {
      console.log(core.getEditor().getValue());
      let button = document.querySelector("#save_wrapper");
      if(ev.srcElement.value == "")
        button.classList.add("disabled");
      else
        button.classList.remove("disabled");
    });
  }
  
  return {
    init: init
  };
}());

var core = (function () {
  let editorObj = {
    editor: null
  };

  function getEditor(){
    return editorObj.editor;
  }
  
  function init(editor){
    editorObj.editor = editor;
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");

    inputListening.init();
    saveButton.init();
    dropDown.init();
  }
  
  return {
    init: init,
    getEditor: getEditor
  };
}());
