const board = (function() {
    const cells = Array(9)
    const initialize = () => cells.fill(null)
    const getCell = (id) => cells[id]
    const markCell = (id, mark) => cells[id] = mark
    const isFull = () => cells.every(cell => !!cell)

    return { initialize, getCell, markCell, isFull }
})()

const displayController = (function() {
    const cells = [...document.querySelectorAll(".cell")]
    const newRound = document.querySelector('#new-round')

    newRound.addEventListener("click", () => {
        newRound.classList.toggle("hidden")
        gameController.reset()
        reset()
        update()
    })

    const reset = () => {
        for (const cell of cells) {
            cell.textContent = ""
            cell.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id")
                gameController.mark(id)
                update()
            },
            { once: true })
        }
    }

    const update = () => {
        for (const cell of cells) {
            const id = cell.getAttribute('data-id')
            cell.textContent = board.getCell(id)
        }

        if (gameController.isGameOver()) {
            if (gameController.hasWinner()) {
                console.log(gameController.getWinner().name + " won!")
            } else {
                console.log("Draw!")
            }

            console.log(gameController.getPlayer(1).score + " : " + gameController.getPlayer(2).score)

            newRound.classList.toggle("hidden")
        }
    }

    return { reset, update, }
})()

const gameController = (function() {
    let current = "X"
    let players = {}
    let winner = null

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

    const isGameOver = () => hasWinner() || board.isFull()

    const getWinner = () => winner
    const getPlayer = (id) => players["player" + id]
    const createPlayer = (name, isX) => ({ name, mark: isX ? "X" : "O", score: 0 })

    const initialize = (name1, name2) => {
        const startPlayer = Math.round(Math.random(1)) + 1
        const player1 = createPlayer(name1, startPlayer === 1)
        const player2 = createPlayer(name2, startPlayer === 2)
        players = { player1, player2 }
        board.initialize()
    }

    const isCurrent = (id) => getPlayer(id).mark === current

    const mark = (id) => {
        if (isGameOver() || board.getCell(id)) {
            return
        }

        board.markCell(id, current)

        if (hasWinner()) {
            winner = getPlayer(1).mark === current ? getPlayer(1) : getPlayer(2)
            winner.score++
        } else {
            current = toggle(current)
        }
    }

    const toggle = (mark) => mark === "X" ? "O" : "X"

    const reset = () => {
        board.initialize()
        for (let i = 1; i <= 2; i++) {
            players["player" + i].mark = toggle(players["player" + i].mark)
        }
    }

    return {
        initialize,
        reset,
        getPlayer,
        isCurrent,
        mark,
        isGameOver,
        hasWinner,
        getWinner,
    }
})()

gameController.initialize("player1", "player2")
displayController.reset()