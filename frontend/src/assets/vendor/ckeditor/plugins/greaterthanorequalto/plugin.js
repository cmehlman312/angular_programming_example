CKEDITOR.plugins.add("greaterthanorequalto", {
  // icon from https://www.flaticon.com/icons
  icons: "greaterthanorequalto",
  init: function (editor) {
    editor.addCommand("greaterthanorequalto", {
      exec: function (editor) {
        editor.insertHtml("greater than or equal to");
      },
    });
    editor.ui.addButton("GreaterThanOrEqualTo", {
      label: "Greater Than or Equal To",
      command: "greaterthanorequalto",
      toolbar: "insert",
    });
  },
});
