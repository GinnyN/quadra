const activeOnArea = (grid, cell) => {
    const {x, y} = cell;
    for(let i = -cell.player.areaTarget; i < cell.player.areaTarget; i+=1){
        for(let z = -cell.player.areaTarget; z < cell.player.areaTarget; z+=1){
            if(grid[x+i] && grid[x+i][y+z] && grid[x+i][y+z].player && 
               grid[x+i][y+z].player.team !== cell.player.team) {
                   return {'x': i, 'y': z};
            }
        }    
    }
}

export { activeOnArea };