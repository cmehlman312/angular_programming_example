/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

// CKEDITOR.plugins.addExternal(
//   "greaterthanorequalto",
//   "./assets/ckeditor_custom_plugins/greaterthanorequalto/",
//   "plugin.js"
// );

// config.extraPlugins = "greaterthanorequalto";

CKEDITOR.editorConfig = function (config) {
  // Define changes to default configuration here. For example:
  // config.language = 'fr';
  // config.uiColor = '#AADC6E';

  config.extraPlugins = [
    "greaterthanorequalto",
    "lessthanorequalto",
    "bulletpoint",
    "temperaturedegree",
    "plusminussign",
  ];

  // Examples taken from https://ckeditor.com/latest/samples/old/toolbar/toolbar.html
  // Toolbar configuration generated automatically by the editor based on config.toolbarGroups.
  config.toolbar = [
    {
      name: "basicstyles",
      groups: ["basicstyles", "cleanup"],
      items: [
        "Bold",
        "Italic",
        "Underline",
        "Strike",
        "Subscript",
        "Superscript",
        "-",
        "CopyFormatting",
        "RemoveFormat",
      ],
    },
    {
      name: "paragraph",
      groups: ["list", "indent", "blocks", "align"],
      items: [
        "NumberedList",
        "BulletedList",
        "-",
        "Outdent",
        "Indent",
        "-",
        "JustifyLeft",
        "JustifyCenter",
        "JustifyRight",
        "JustifyBlock",
      ],
    },
    {
      name: "insert",
      items: [
        "Table",
        "HorizontalRule",
        "SpecialChar",
        "-",
        "GreaterThanOrEqualTo",
        "LessThanOrEqualTo",
        "BulletPoint",
        "TemperatureDegree",
        "PlusMinusSign",
      ],
    },
    {
      name: "clipboard",
      groups: ["clipboard", "undo"],
      items: [
        "Cut",
        "Copy",
        "Paste",
        "PasteText",
        "PasteFromWord",
        "-",
        "Undo",
        "Redo",
      ],
    },
    {
      name: "editing",
      groups: ["find", "selection", "spellchecker"],
      items: ["Find", "Replace", "-", "SelectAll", "-", "Scayt"],
    },
    {
      name: "document",
      groups: ["mode", "document", "doctools"],
      items: ["Source"],
    },
    "/",
    { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "tools", items: ["Maximize", "ShowBlocks"] },
  ];
};

CKEDITOR.on("instanceReady", function (event) {
  event.editor.on("beforeCommandExec", function (event) {
    // Show the paste dialog for the paste buttons and right-click paste
    if (event.data.name == "paste") {
      event.editor._.forcePasteDialog = true;
    }
    // Don't show the paste dialog for Ctrl+Shift+V
    if (
      event.data.name == "pastetext" &&
      event.data.commandData.from == "keystrokeHandler"
    ) {
      event.cancel();
    }
  });
});
