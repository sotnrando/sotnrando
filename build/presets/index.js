(function(self) {

  if (self) {    
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      presets: self.sotnRando.presets,
    })
  } else {
    // We will use this to know which preset we loaded already.
    // If you add any new inheritance preset, add it here.
    const inheritancePresets = [
      'casual',
      'safe',
      'adventure',
      'nimble',
      'open',
      'nimble-lite',
    ]
    // List of all presets. If you add *any* preset, add it here.
    const presets = [
      'adventure',
      'agonize-twtw',
      'all-bosses',
      'anguish',
      'any-percent',
      'aperture',
      'april-fools',
      'bat-master',
      'battle-mage',
      'beyond',
      'big-toss',
      'bingo',
      'boss-rush',
      'bounty-hunter',
      'brawler',
      'breach',
      'casual',
      'chaos-lite',
      'chimera',
      'chimera-te',
      'cornivus',
      'cornivus-te',
      'crash-course',
      'cursed-night',
      'dog-life',
      'empty-hand',
      'expedition',
      'first-castle',
      'gear-rush',
      'gem-farmer',
      'glitch',
      'glitch-legacy',
      'glitchmaster',
      'gourmet-race',
      'grand-tour',
      'guarded-og',
      'hitman',
      'leg-day',
      'lookingglass',
      'lucky-sevens',
      'lycanthrope',
      'lycanthrope-spr26te',
      'magic-mirror',
      'max-rando',
      'mirror-breaker',
      'mobility',
      'nimble',
      'nimble-lite',
      'nimble-lite-spr26te',
      'nimble-lite-te',
      'og',
      'open',
      'oracle',
      'rampage-aut25te',
      'rampage',
      'rat-race',
      'recycler',
      'recycler-te',
      'safe',
      'safe-stwo',
      'scavenger',
      'seeker',
      'sequence-breaker',
      'sight-seer',
      'skinwalker',
      'spellbound',
      'summoner',
      'target-confirmed',
      'test',
      'third-castle',
      'timeline',
      'vanilla',
      'warlock',
      'warlock-spr26te',
    ]
    function loadInheritancePresets(preset) {
      // Load the basic presets.
      const presets = inheritancePresets.map(function(preset) {
        return require(`./${preset}`)
      })
      // Then only load the file of the specified preset.
      if (preset !== undefined && !(preset in inheritancePresets)) {
        presets.push(require(`./${preset}`))
      }
      return presets
    }
    function loadPresets() {
      return presets.map(function(preset) {
        return require(`./${preset}`)
      })
    }
    module.exports = {
      loadInheritancePresets: loadInheritancePresets,
      loadPresets: loadPresets,
    }
  }
})(typeof(self) !== 'undefined' ? self : null)
