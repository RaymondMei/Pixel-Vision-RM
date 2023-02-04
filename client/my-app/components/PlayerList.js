import React from 'react'
import PlayerListTile from './PlayerListTile.js'

const colorList = ["red", "darkorange", "gold", "lime", "turquoise", "indigo", "purple", "mediumvioletred"]
const avatarList = ["😀", "😎", "🙁", "😨", "😳", "🤡", "😈", "💀"]

//displays list of players in the lobby 
function PlayerList({ players }) {
    let listIndex = -1
    return (
        <div className="p-list h-100 d-flex flex-column justify-content-start overflow-auto list-group list-group-flush">
            {players.map((player) => {
                listIndex = (listIndex + 1) % 8
                return (
                    <PlayerListTile username={player} color={colorList[listIndex]} avatar={avatarList[listIndex]}
                        isAdmin={listIndex == 0} />
                )
            })}

        </div>
    )
}

export default PlayerList