const { remote, shell } = require('electron')

const template = [
  {
    label: 'Items',
    submenu: [
      {
        label: 'Add New',
        click: window.newItem,
        accelerator: 'CmdOrCtrl+N'
      },
      {
        label: 'Read Item',
        click: window.openItem,
        accelerator: 'CmdOrCtrl+Enter'
      },
      {
        label: 'Delete Item',
        click: window.deleteItem,
        accelerator: 'CmdOrCtrl+Backspace'
      },
      {
        label: 'Open in Browser',
        click: window.openItemNative,
        accelerator: 'CmdOrCtrl+O'
      },
      {
        label: 'Search Items',
        click: window.searchItems,
        accelerator: 'CmdOrCtrl+S'
      }
    ]
  },
  {
    role: 'editMenu'
  },
  {
    role: 'windowMenu'
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn more',
        click: () => {
          shell.openExternal('https://github.com/rmamchyk/electron-readit')
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: remote.app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })
}

const menu = remote.Menu.buildFromTemplate(template);

remote.Menu.setApplicationMenu(menu);