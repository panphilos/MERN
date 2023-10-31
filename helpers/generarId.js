const generarId = () => {
    const random = Date.now().toString(32) + Math.random().toString(32).substring(2);
    //console.log(random);
    return random;

}

export default generarId;