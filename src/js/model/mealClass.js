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

        var orderedSteps = this.steps.sort((a, b) => { return a.duration < b.duration; });

        if (orderedSteps.length > 0 ) this.duration = orderedSteps[0].duration;
        else this.duration = 0;
    };

    Meal.prototype.formattedDuration = function () {
        return util.formatDuration(this.duration);
    };

    Meal.prototype.stepCount = function() {
        return this.steps.length;
    };

    Meal.prototype.hasSteps = function() {
        return this.steps.length > 0;
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