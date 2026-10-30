const fs = require('fs')
const readline = require('node:readline')
const yargs = require('yargs')
const { stdin: input, stdout: output } = require('node:process')

const common = require('./common.js')

const rl = readline.createInterface({ input, output })

function renderState(source, currentState, scale=2) {
    console.log('')
    const roomInfo = source.roomData[currentState.stage][currentState.room]
    for (let row = 0; row < (scale * roomInfo.rows); row++) {
        const cells = []
        for (let column = 0; column < (scale * roomInfo.columns); column++) {
            let cell = '.'
            const left = (256 / scale) * column
            const right = left + (256 / scale)
            const top = (256 / scale) * row
            const bottom = top + (256 / scale)
            if (
                currentState.positionX >= left &&
                currentState.positionX < right &&
                currentState.positionY >= top &&
                currentState.positionY < bottom
            ) {
                cell = '@'
            }
            cells.push(cell)
        }
        console.log(cells.join(''))
    }
    console.log('location:', currentState.stage, currentState.room, currentState.section)
}

function run(source, currentState) {
    renderState(source, currentState)
    const commands = {}
    const commandMap = new Map()
    source.logic[currentState.stage][currentState.room]
    .filter((command) => {
        // If a command is a location check, only count it if reward-tracking is enabled
        return (
            (
                (command.commandName ?? '').startsWith('location') &&
                (command.requirement.progressionRewardTracking ?? false)
            ) ||
            !(command.commandName ?? '').startsWith('location')
        )
    })
    .toSorted((a, b) => {
        let result = a.commandName.localeCompare(b.commandName)
        if (result === 0) {
            const A = common.isValidRequirement(currentState, a.requirement) ? 1 : 0
            const B = common.isValidRequirement(currentState, b.requirement) ? 1 : 0
            result = B - A
        }
        return result
    })
    .forEach((command, index) => {
        if (!(commandMap.has(command.commandName))) {
            const commandId = '1234568790abcdefghijklmnopqrstuvwxyz'.at(commandMap.size)
            commands[commandId] = command
            commandMap.set(command.commandName, [])
            commandMap[command.commandName] = []
            if (common.isValidRequirement(currentState, command.requirement)) {
                console.log(`- [${commandId}] ${command.commandName}`)
            }
            else {
                console.log(`- [.] ${command.commandName}`)
            }
        }
        commandMap.get(command.commandName).push(command)
    })
    rl.question('> ', (reply) => {
        // console.log('Reply:', reply)
        if (reply.toUpperCase() === 'STATE') {
            console.log('currentState:', currentState)
        }
        else if (reply.toUpperCase().startsWith('FIND ')) {
            const goal = {}
            let searchTime = 60.0
            reply.split(' ').slice(1)
            .forEach((searchTerm) => {
                const kv = searchTerm.split('=')
                if (kv.at(0) === 't') {
                    searchTime = Number.parseFloat(kv.at(1))
                }
                else {
                    goal[kv.at(0)] = kv.at(1)
                }
            })
            const searchState = Object.assign({}, currentState)
            searchState.time = Math.min(searchTime, searchState.time)
            const nextState = common.findGoal(source.logic, searchState, goal, false)
            if (nextState === null) {
                console.log('GOAL NOT FOUND')
            }
            else {
                nextState.time = Math.max(0, currentState.time - (searchTime - nextState.time))
                Object.assign(currentState, nextState)
            }
        }
        else if (common.isValidRequirement(currentState, commands[reply].requirement)) {
            const prevState = Object.assign({}, currentState)
            common.updateStateWithOutcome(currentState, commands[reply].outcome)
            Object.entries(currentState)
            .filter(([stateKey, stateValue]) => {
                return !(['stage', 'room', 'positionX', 'positionY'].includes(stateKey))
            })
            .forEach(([stateKey, stateValue]) => {
                if (stateValue !== prevState[stateKey]) {
                    console.log(` + ${stateKey} = ${stateValue}`)
                }
            })
        }
        else {
            console.log('INVALID COMMAND')
        }
        run(source, currentState)
    })
}

const argv = yargs(process.argv.slice(2))
    .command({ // run
        command: 'run',
        describe: 'TODO',
        builder: (yargs) => {
            return yargs
        // Main options
            .option('debug', {
                alias: 'd',
                describe: 'Debug file to interact with',
                type: 'string',
                normalize: true,
            })
        // The following options must be declared
            .demandOption(['debug'])
        },
        handler: (argv) => {
            const debugFile = JSON.parse(fs.readFileSync(argv.debug, 'utf8'))
            console.log(debugFile.shortDescription)
            const startingState = {
                stage: 'castleEntrance',
                room: 'afterDrawbridge',
                section: 'main',
                positionX: 136,
                positionY: 640,
                time: 3600.0,
                techniqueLogicalRisks: true,
                techniqueSolveBoxPuzzle: true,
                progressionRewardTracking: true,
            }
            let currentState = Object.assign({}, startingState)
            run(debugFile, currentState)
        },
    })
    .demandCommand(1)
    .help()
    .parse()