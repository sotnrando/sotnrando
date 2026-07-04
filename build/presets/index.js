(function(self) {

  if (self) {    
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      presets: self.sotnRando.presets,
    })
  } else {
    // We will use this to know which preset we loaded already.
    // If you add any new inheritance preset, add it here.
    const presetsData = require('../../preset-data.json')
    let presets = []
    let inheritancePresets = []
    // Load all the presets
    presetsData.forEach((preset) => {
      presets.push(preset.id)
      if(preset.parent === true){
        inheritancePresets.push(preset.id)
      }
    })

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
