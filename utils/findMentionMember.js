const findMember = (target) => {
    while (1) {
        target = target.slice(1)
        if (target.startsWith('<@')) {
            while (1) {
                target = target.slice(0, -1)
                if (target.endsWith('>')) { 
                    return target;   
                }
            } break
        }
    };
    
};

module.exports.findMember = findMember;