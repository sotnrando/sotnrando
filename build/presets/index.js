(function(self) {

  let exports
  if (self) {    
    exports = self.sotnRando.presets
  } else {
    // Load the basic presets. All preset used as part of inheritance must be here.
    exports = [
      require('./casual'),
      require('./safe'),
      require('./adventure'),
      require('./nimble'),
      require('./open'),
      require('./nimble-lite'),
    ]
    // We will use this to know which preset we loaded already. If you add any new inheritance preset, add it here.
    let loadedPresets = ["casual", "safe", "adventure", "nimble", "open", "nimble-lite"]  
    // Then only load the file of the specified preset
    if(!(process.env.chosenPreset in loadedPresets) && process.env.chosenPreset !== undefined){   
      let presetToLoad = process.env.chosenPreset
      loadPreset = require(`./${presetToLoad}`)      
      exports.push(loadPreset)
    }
  }

  if (self) {    
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      presets: exports,
    })
  } else {
    module.exports = exports
  }
})(typeof(self) !== 'undefined' ? self : null)
