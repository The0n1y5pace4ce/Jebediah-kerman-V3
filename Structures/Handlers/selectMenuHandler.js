async function loadSelectMenus(client) {
    const { loadFiles } = require("../Functions/fileLoader");
    const ascii = require("ascii-table");
    const table = new ascii("Select Menus List");
    
    const Files = await loadFiles("SelectMenus");
    
    Files.forEach((file) => {
      const selectMenu = require(file);
      if (!selectMenu.id) return;
  
      client.selectMenus.set(selectMenu.id, selectMenu);
      table.setHeading(`SelectMenu ID`, `Status`);
      table.addRow(`${selectMenu.id}`, "🟩 Success");
    });
    
    return console.log(table.toString())
  }
      
  module.exports = { loadSelectMenus };