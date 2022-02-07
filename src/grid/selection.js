const square = (item, temp, variable, value, variable2 = false, value2 = false) => {
    const {amount} = variable === 'activated' ? item.player.movement : item.player.attack;
    const {x,y} = item;
    const noUsable = [];
    for(let i = amount * -1; i <= amount; i+=1) {
        for(let z = amount * -1; z <= amount; z+=1){
            if(temp[x+i]) {
                if(temp[x+i][y+z]) {
                    if(!temp[x+i][y+z].usable) noUsable.push(temp[x+i][y+z]);
                    temp[x+i][y+z][variable] = value;
                    if(variable2) {
                        if(temp[x+i][y+z][variable2[0]]) temp[x+i][y+z][variable2[0]][variable2[1]] = value2;
                    }
                }
            }
        }
    }
    noUsable.map((item) => {
        for(let i = 0; i <= amount; i+=1) {
            for(let z = 0; z <= amount; z+=1){
                if(item.x >= x){
                    if(item.y <= y && temp[item.x+i] && temp[item.x+i][item.y-z]) {
                        temp[item.x+i][item.y-z][variable] = false;
                        if(variable2) {
                            if(temp[item.x+i][item.y-z][variable2[0]]) temp[item.x+i][item.y-z][variable2[0]][variable2[1]] = false;
                        }
                    }
                    if(item.y >= y && temp[item.x+i] && temp[item.x+i][item.y+z]) {
                        temp[item.x+i][item.y+z][variable] = false;
                        if(variable2) {
                            if(temp[item.x+i][item.y+z][variable2[0]]) temp[item.x+i][item.y+z][variable2[0]][variable2[1]] = false;
                        }
                    }
                }
                if(item.x <= x) {
                    if(item.y <= y && temp[item.x-i] && temp[item.x-i][item.y-z]) {
                        temp[item.x-i][item.y-z][variable] = false;
                        if(variable2) {
                            if(temp[item.x-i][item.y-z][variable2[0]]) temp[item.x-i][item.y-z][variable2[0]][variable2[1]] = false;
                        }
                    }
                    if(item.y >= y && temp[item.x-i] && temp[item.x-i][item.y+z]) {
                        temp[item.x-i][item.y+z][variable] = false;
                        if(variable2) {
                            if(temp[item.x-i][item.y+z][variable2[0]]) temp[item.x-i][item.y+z][variable2[0]][variable2[1]] = false;
                        }
                    }
                }
            }
        }
    })
    return temp;
}

export { square };