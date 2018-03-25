function mealClass(stepClass) {

    function Meal() {
        var self = this;
        self.id = '';
        self.name = '';
        self.duration = 60;
        self.steps = [];
    }

    Meal.prototype.formattedDuration = function () {
        var hours = Math.floor((this.duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((this.duration % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor(((this.duration % (1000 * 60)) / 1000));

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    Meal.build = (dto) => {
        var meal = new Meal();

        if (!dto) return meal;

        meal.id = dto.id;
        meal.name = dto.name;
        meal.duration = dto.duration;
        meal.steps = dto.steps.map(stepClass.build);

        return meal;
    };

    return Meal;
}