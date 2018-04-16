'use strict';

function mealClass(util, stepClass) {

    function Meal() {
        var self = this;
        self.id = util.createUUID();
        self.name = '';
        self.duration = 0;
        self.steps = [];
    }

    Meal.prototype.convertStepsToDuration = function() {
        var duration = 0;

        this.steps.forEach((step) => duration += step.duration );

        this.duration = duration;
    };

    Meal.prototype.formattedDuration = function () {
        return util.formatDuration(this.duration);
    };

    Meal.build = (dto) => {
        var meal = new Meal();

        if (!dto) return meal;

        meal.id = dto.id;
        meal.name = dto.name;
        meal.steps = dto.steps ? dto.steps.map(stepClass.build) : [];

        meal.convertStepsToDuration();

        return meal;
    };

    return Meal;
}