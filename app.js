const board = (function() {
    const cells = Array(9).fill(null)
    const getCell = (id) => cells[id]
    const markCell = (id, mark) => cells[id] = mark

    return { getCell, markCell }
})()

const displayController = (function() {
    const cells = [...document.querySelectorAll(".cell")]

    const initialize = () => {
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
    }

    return { initialize, update, }
})()

const gameController = (function() {
    let current = "X"
    let players = {}

    const getPlayer = (id) => players["player" + id]
    const createPlayer = (name, isX) => ({ name, mark: isX ? "X" : "O", score: 0 })

    const initialize = (name1, name2) => {
        const startPlayer = Math.round(Math.random(1)) + 1
        const player1 = createPlayer(name1, startPlayer === 1)
        const player2 = createPlayer(name2, startPlayer === 2)
        players = { player1, player2 }
    }

    const isCurrent = (id) => getPlayer(id).mark === current

    const mark = (id) => {
        board.markCell(id, current)
        current = current === "X" ? "O" : "X"
    }

    return { initialize, getPlayer, isCurrent, mark, }
})()

gameController.initialize("player1", "player2")
displayController.initialize()