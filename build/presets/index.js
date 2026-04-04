(function(self) {

  if (self) {    
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      presets: self.sotnRando.presets,
    })
  } else {
    // We will use this to know which preset we loaded already.
    // If you add any new inheritance preset, add it here.
    const loadedPresets = [
      'casual',
      'safe',
      'adventure',
      'nimble',
      'open',
      'nimble-lite',
    ]
    module.exports = function(preset) {
      // Load the basic presets.
      const presets = loadedPresets.map(function(preset) {
        return require(`./${preset}`)
      })
      // Then only load the file of the specified preset.
      if (preset !== undefined && !(preset in loadedPresets)) {
        presets.push(require(`./${preset}`))
      }
      return presets
    }
  }
})(typeof(self) !== 'undefined' ? self : null)
