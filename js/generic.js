function randomRange(min, max) {
    return Math.random()*(max-min) + min;
}

function extend(child, supertype) {
    child.prototype.__proto__ = supertype.prototype;
}
