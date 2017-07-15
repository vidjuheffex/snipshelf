let SimpleError = {
  create(type) {
    var simpleError = Object.create(SimpleError.prototype);
    return simpleError;
  },
  prototype: {
    createOrUpdateProperty(key, msg){
      this[key] = this[key] || [];
      this[key].push({msg: msg});
    }
  }
};

module.exports = SimpleError;
