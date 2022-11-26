const board = (function() {
    const cells = Array(9)
    const initialize = () => cells.fill(null)
    const getCell = (id) => cells[id]
    const mark = (id, marker) => cells[id] = marker
    const isFull = () => cells.every(cell => !!cell)

    return { initialize, getCell, mark, isFull }
})()

const display = (function() {
    const cells = [...document.querySelectorAll(".cell")]
    const newRound = document.querySelector('#new-round')

    newRound.addEventListener("click", () => {
        newRound.classList.add("hidden")
        game.reset()
        updateMarks()
        update()
    })

    const setNames = () => {
        for (let i = 1; i <= 2; i++) {
            document.querySelector("#name-" + i).textContent = game.getPlayer(i).name
        }
    }

    const updateMarks = () => {
        for (let i = 1; i <= 2; i++) {
            document.querySelector("#marker-" + i).textContent = game.getPlayer(i).marker
        }
    }

    const updateScores = () => {
        for (let i = 1; i <= 2; i++) {
            document.querySelector("#score-" + i).textContent = game.getPlayer(i).score
        }
    }

    const initialize = () => {
        setNames()
        updateMarks()
        updateScores()

        for (const cell of cells) {
            cell.textContent = ""
            cell.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id")
                game.mark(id)
                update()
            })
        }
    }

    const update = () => {
        for (const cell of cells) {
            const id = cell.getAttribute('data-id')
            cell.textContent = board.getCell(id)
        }

        if (game.isOver()) {
            if (game.hasWinner()) {
                console.log(game.getWinner().name + " won!")
            } else {
                console.log("Draw!")
            }

            updateScores()

            newRound.classList.remove("hidden")
        }
    }

    return { initialize, update, }
})()

const game = (function() {
    let current = "X"
    let players = {}
    let winner = null

    const getPlayer = (id) => players[id]
    const createPlayer = (name, isX) => ({ name, marker: isX ? "X" : "O", score: 0 })
    const getWinner = () => winner

    const winConditions = [
        // rows:
        [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ],

        // columns:
        [ 0, 3, 6 ], [ 1, 4, 7 ], [ 2, 5, 8 ],

        // diagonals:
        [ 0, 4, 8 ], [ 2, 4, 6 ],
    ]

    const isMet = (windCondition) => !!windCondition.reduce(
        (previousCell, id) => previousCell === board.getCell(id) ? previousCell : false,
        board.getCell(windCondition[0]))

    const hasWinner = () => winConditions.reduce(
        (hasWinner, current) => isMet(current) ? true : hasWinner,
        false)

    const isOver = () => hasWinner() || board.isFull()

    const initialize = (name1, name2) => {
        const startPlayer = Math.round(Math.random(1)) + 1
        const player1 = createPlayer(name1, startPlayer === 1)
        const player2 = createPlayer(name2, startPlayer === 2)
        players = { "1": player1, "2": player2 }
        board.initialize()
    }

    const toggle = (marker) => marker === "X" ? "O" : "X"

    const mark = (id) => {
        if (isOver() || board.getCell(id)) {
            return
        }

        board.mark(id, current)

        if (hasWinner()) {
            winner = getPlayer(1).marker === current ? getPlayer(1) : getPlayer(2)
            winner.score++
            current = "X"
        } else {
            current = toggle(current)
        }
    }

    const reset = () => {
        board.initialize()
        for (let i = 1; i <= 2; i++) {
            players[i].marker = toggle(players[i].marker)
        }
    }

    return {
        initialize,
        reset,
        getPlayer,
        mark,
        isOver,
        hasWinner,
        getWinner,
    }
})()

game.initialize("player1", "player2")
display.initialize()