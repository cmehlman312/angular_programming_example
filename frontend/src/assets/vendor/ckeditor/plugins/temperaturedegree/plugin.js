CKEDITOR.plugins.add("temperaturedegree", {
  // icon from https://www.flaticon.com/icons
  icons: "temperaturedegree",
  init: function (editor) {
    editor.addCommand("temperaturedegree", {
      exec: function (editor) {
        editor.insertHtml("&deg;");
      },
    });
    editor.ui.addButton("TemperatureDegree", {
      label: "Temperature Degree",
      command: "temperaturedegree",
      toolbar: "insert",
    });
  },
});
