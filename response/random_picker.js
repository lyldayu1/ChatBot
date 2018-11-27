// Random array picker
module.exports = function randomPick(array){
    var randomAnswer = [Math.floor(Math.random() *
                        array.length)];
    return array[randomAnswer]
}
