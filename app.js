const board = (function() {
    const cells = Array(9)
    const initialize = () => cells.fill(null)
    const getCell = (id) => cells[id]
    const mark = (id, marker) => cells[id] = marker
    const isFull = () => cells.every(cell => !!cell)

    return { initialize, getCell, mark, isFull }
})()

const game = (function() {
    let winner = null
    const player = { name: "Player", marker: "X", score: 0 }
    const computer = { name: "Computer", marker: "O", score: 0 }

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

    const initialize = () => board.initialize()

    const mark = (id) => {
        if (isOver() || board.getCell(id)) {
            return
        }

        board.mark(id, player.marker)

        if (hasWinner()) {
            winner = player
            winner.score++
        } else {
            makeComputerMove()
        }
    }

    const makeComputerMove = () => {
        let id

        do {
            id = Math.round(Math.random() * 8)
        } while (board.getCell(id))

        board.mark(id, computer.marker)

        if (hasWinner()) {
            winner = computer
            winner.score++
        }
    }

    const reset = () => {
        board.initialize()
        const swap = player.marker
        player.marker = computer.marker
        computer.marker = swap

        if (computer.marker === "X") {
            makeComputerMove()
        }
    }

    return {
        initialize,
        reset,
        mark,
        isOver,
        hasWinner,
        winner,
        player,
        computer
    }
})()

const display = (function() {
    const btnNewRound = document.querySelector('#btn-new-round')
    const cells = [...document.querySelectorAll(".cell")]

    toggleHidden = (...elements) => {
        for (const element of elements) {
            element.classList.toggle("hidden")
        }
    }

    btnNewRound.addEventListener("click", () => {
        game.reset()
        updateMarks()
        update()
        toggleHidden(btnNewRound)
    })

    const setNames = () => {
        document.querySelector("#name-player").textContent = game.player.name
        document.querySelector("#name-computer").textContent = game.computer.name
    }

    const updateMarks = () => {
        document.querySelector("#marker-player").textContent = game.player.marker
        document.querySelector("#marker-computer").textContent = game.computer.marker
    }

    const updateScores = () => {
        document.querySelector("#score-player").textContent = game.player.score
        document.querySelector("#score-computer").textContent = game.computer.score
    }

    const showBoard = () => {
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
            updateScores()
            btnNewRound.classList.remove("hidden")
        }
    }

    game.initialize()
    showBoard()
})()