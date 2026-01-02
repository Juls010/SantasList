const Storage = {
    key: "santaList",

    get: function() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    },

    save: function(gifts) {
        localStorage.setItem(this.key, JSON.stringify(gifts));
    },

    add: function(gift) {
        const gifts = this.get();
        gifts.push(gift);
        this.save(gifts);
    },

    remove: function(name) {
        const gifts = this.get().filter(g => g.name !== name);
        this.save(gifts);
    },

    toggle: function(name) {
        const gifts = this.get();
        const gift = gifts.find(g => g.name === name);
        
        if (gift) {
            gift.bought = !gift.bought;
            this.save(gifts);
        }
    }
};