const { Button } = require('./components')


function RoomButtons(){
    const btn1 = new Button()
    btn1.add("roomnamebtn", "name", btn1.style.Secondary)
    btn1.add("roomlimitbtn", "limit", btn1.style.Secondary)
    btn1.add("roomlockbtn", "lock", btn1.style.Secondary)
    btn1.add("adduserbtn", "add", btn1.style.Primary)
    
    const btn2 = new Button()
    btn2.add("deleteuserbtn", "remove", btn2.style.Danger)
    btn2.add("kickuserbtn", "kick", btn2.style.Danger)
    btn2.add("roomdeletebtn", "delete", btn2.style.Danger)
    
    const action1 = btn1.build()
    const action2 = btn2.build()

    return [action1, action2]
}

module.exports = {
    RoomButtons
}