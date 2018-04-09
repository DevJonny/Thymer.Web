'use strict';

function mealClass(stepClass) {

    function Meal() {
        var self = this;
        self.id = create_UUID();
        self.name = '';
        self.duration = 0;
        self.steps = [];
    }

    Meal.prototype.convertStepsToDuration = function() {
        var duration = 0;

        this.steps.forEach((step) => {
           duration += ((step.hours * 60) * 60) * 1000;
           duration += (step.minutes * 60) * 1000;
           duration += step.seconds * 1000;
        });

        this.duration = duration;
    };

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
        meal.steps = dto.steps ? dto.steps.map(stepClass.build) : [];

        if (meal.duration === 0) meal.convertStepsToDuration();

        return meal;
    };

    return Meal;
}