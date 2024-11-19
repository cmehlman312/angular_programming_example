CKEDITOR.plugins.add("lessthanorequalto", {
  // icon from https://www.flaticon.com/icons
  icons: "lessthanorequalto",
  init: function (editor) {
    editor.addCommand("lessthanorequalto", {
      exec: function (editor) {
        editor.insertHtml("less than or equal to");
      },
    });
    editor.ui.addButton("LessThanOrEqualTo", {
      label: "Is Less Than or Equal To",
      command: "lessthanorequalto",
      toolbar: "insert",
    });
  },
});
