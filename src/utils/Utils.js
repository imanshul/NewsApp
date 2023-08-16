const Utils = {

    mergeByProperty(target, source, prop) {
        source.forEach(sourceElement => {
            let targetElement = target.find(targetElement => {
                return sourceElement[prop] === targetElement[prop];
            })
            targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
        })
    },

    getRandomElementsWithUnread(arr, count) {
        const unreadElements = arr.filter(item => item.read !== true);
        const randomElements = [];

        while (randomElements.length < count && unreadElements.length > 0) {
            const randomIndex = Math.floor(Math.random() * unreadElements.length);
            const randomElement = unreadElements.splice(randomIndex, 1)[0];
            randomElement.read = true; // Mark as read
            randomElements.push(randomElement);
        }

        return randomElements;
    }

}
export default Utils