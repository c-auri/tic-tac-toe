const board = (function() {
    const cells = Array(9).fill(null)
    const getCell = (id) => cells[id]
    const markCell = (id, mark) => cells[id] = mark

    return { getCell, markCell, }
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
    let current = 0
    const players = []
    const addPlayer = (name, mark) => players.push({ name, mark })
    const mark = (id) => {
        board.markCell(id, players[current].mark)
        current = (current + 1) % 2
    }

    return { addPlayer, mark, }
})()

displayController.initialize()