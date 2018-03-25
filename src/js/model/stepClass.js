function stepClass() {
    function Step()  {
        this.id = '';
        this.name = '';
        this.duration = '';
    }

    Step.build = function(dto) {
        var step = new Step();

        if (!dto) return step;

        step.id = dto.id;
        step.name = dto.name;
        step.duration = dto.duration;
    }

    return Step;
}