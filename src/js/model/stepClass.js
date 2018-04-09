function stepClass() {
    function Step()  {
        this.id = '';
        this.name = '';
        this.duration = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
    }

    Step.prototype.formattedDuration = function () {
        var hours = Math.floor((this.duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((this.duration % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor(((this.duration % (1000 * 60)) / 1000));

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    Step.build = function(dto) {
        var step = new Step();

        if (!dto) return step;

        step.id = dto.id;
        step.name = dto.name;
        step.duration = dto.duration;
    }

    return Step;
}