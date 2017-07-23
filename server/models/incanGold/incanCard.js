class IncanCard {
    constructor(t,n,v) {
        this.type = t;
        this.name = n;
        this.value = v;
        this.image = '';
        if (this.type == "treasure") {
            this.image = `/incan/${this.value}${this.name}.png`;
        }
        else {
            this.image = `/incan/${this.name}.png`;
        }   
    }
    
}

module.exports = IncanCard;