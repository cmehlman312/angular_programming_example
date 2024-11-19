CKEDITOR.plugins.add("plusminussign", {
  // icon from https://www.flaticon.com/icons
  icons: "plusminussign",
  init: function (editor) {
    editor.addCommand("plusminussign", {
      exec: function (editor) {
        editor.insertHtml("&plusmn;");
      },
    });
    editor.ui.addButton("PlusMinusSign", {
      label: "Plus Minus Sign",
      command: "plusminussign",
      toolbar: "insert",
    });
  },
});
