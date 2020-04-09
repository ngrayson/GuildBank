BaseItem = require('../db/BaseItem.js');

async function newBaseItem (name) {
    let newItem = BaseItem.newBaseItem({
        name: name
    })
    return newItem;
}

module.exports = {
    newBaseItem
};