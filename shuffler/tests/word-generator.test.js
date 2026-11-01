const test = require('node:test')
const assert = require('node:assert')

const wordGenerator = require('../word-generator.js')

// Test the getSeedName function to ensure the seed names it generates fall within expected bounds
const TEST_WORDS = {
    adjectives: [],
    nouns: [],
}
for (let i = 0; i < 12; i++) {
    TEST_WORDS.adjectives.push('abcdefghijkl'.at(i).repeat(i + 1))
    TEST_WORDS.nouns.push('mnopqrstuvwx'.at(i).repeat(i + 1))
}
const testSeedNames = [
    {
        testDescription: 'Test seeds generated against the default word list',
        input: {
            seed: '123',
            trials: 10000,
            words: null,
        },
    },
    {
        testDescription: 'Test seeds generated from an extremely short list of words between 1 and 12 characters long',
        input: {
            seed: '123',
            trials: 10000,
            words: TEST_WORDS,
        },
    },
]

testSeedNames
.forEach((testData) => {
    const MIN_VALID_BYTE_LENGTH = 9
    const MAX_VALID_BYTE_LENGTH = 32
    test.test(`getSeedName - ${testData.testDescription}`, () => {
        const seeds = {
            shortest: {
                byteCount: Number.POSITIVE_INFINITY,
                seedName: '',
            },
            longest: {
                byteCount: Number.NEGATIVE_INFINITY,
                seedName: '',
            },
            withInvalidChars: [],
        }
        for (let trial = 0; trial < testData.input.trials; trial++) {
            const seedName = wordGenerator.getSeedName(testData.input.seed + '.' + trial, testData.input.words)
            // console.log('seedName:', seedName)
            let byteCount = 1
            let invalidCharCount = 0
            for (const char of seedName) {
                if ('0123456789'.includes(char)) {
                    byteCount += 2
                }
                else if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(char)) {
                    byteCount += 1
                }
                else {
                    // NOTE(sestren): The byte count of invalid characters is naively assumed to be 2
                    byteCount += 2
                    invalidCharCount += 1
                }
            }
            if (byteCount < seeds.shortest.byteCount) {
                seeds.shortest.seedName = seedName
                seeds.shortest.byteCount = byteCount
            }
            if (byteCount > seeds.longest.byteCount) {
                seeds.longest.seedName = seedName
                seeds.longest.byteCount = byteCount
            }
            if (invalidCharCount > 0) {
                seeds.withInvalidChars.push(seedName)
            }
        }
        assert.ok(
            seeds.shortest.byteCount >= MIN_VALID_BYTE_LENGTH,
            `Shortest seed name '${seeds.shortest.seedName}' is too short by ${MIN_VALID_BYTE_LENGTH - seeds.shortest.byteCount} byte(s)`
        )
        assert.ok(
            seeds.longest.byteCount <= MAX_VALID_BYTE_LENGTH,
            `Longest seed name '${seeds.longest.seedName}' is too long by ${seeds.longest.byteCount - MAX_VALID_BYTE_LENGTH} byte(s)`
        )
        assert.ok(
            seeds.withInvalidChars.length < 1,
            `Seeds contained invalid characters (count: ${seeds.withInvalidChars.length}, first: ${seeds.withInvalidChars.at(0)})`
        )
    })
})
