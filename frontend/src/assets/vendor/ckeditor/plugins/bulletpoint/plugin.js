CKEDITOR.plugins.add("bulletpoint", {
  // icon from https://www.flaticon.com/icons
  icons: "bulletpoint",
  init: function (editor) {
    editor.addCommand("bulletpoint", {
      exec: function (editor) {
        editor.insertHtml("&bull;");
      },
    });
    editor.ui.addButton("BulletPoint", {
      label: "Bullet Point",
      command: "bulletpoint",
      toolbar: "insert",
    });
  },
});
