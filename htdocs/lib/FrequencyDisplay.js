function FrequencyDisplay(element) {
    this.element = $(element);
    this.digits = [];
    this.setupElements();
    this.setFrequency(0);
}

FrequencyDisplay.prototype.setupElements = function() {
    this.displayContainer = $('<div>');
    this.digitContainer = $('<span>');
    this.displayContainer.html([this.digitContainer, $('<span>')]);
    this.element.html(this.displayContainer);
};

FrequencyDisplay.prototype.setFrequency = function(freq) {
    this.frequency = freq;
    this.update();
}

FrequencyDisplay.prototype.update = function() {
    var unitText = $('#option-freq-unit option:selected').text();
    var unit = '1e' + $('#option-freq-unit').val();
    var decimals = $('#option-freq-decimals').val();

    var formatted = (this.frequency / unit).toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
    var children = this.digitContainer.children();

    for (var i = 0; i < formatted.length; i++) {
        if (!this.digits[i]) {
            this.digits[i] = $('<span>');
            var before = children[i];
            if (before) {
                $(before).after(this.digits[i]);
            } else {
                this.digitContainer.append(this.digits[i]);
            }
        }
        this.digits[i][(isNaN(formatted[i]) ? 'remove' : 'add') + 'Class']('digit');
        this.digits[i].html(formatted[i]);
    }
    while (this.digits.length > formatted.length) {
        this.digits.pop().remove();
    }
    this.displayContainer.children().last().text(' ' + unitText);
};

function TuneableFrequencyDisplay(element) {
    FrequencyDisplay.call(this, element);
    this.setupEvents();
}

TuneableFrequencyDisplay.prototype = new FrequencyDisplay();

TuneableFrequencyDisplay.prototype.setupElements = function() {
    FrequencyDisplay.prototype.setupElements.call(this);
    this.input = $('<input>');
    this.input.hide();
    this.element.append(this.input);
};

TuneableFrequencyDisplay.prototype.setupEvents = function() {
    var me = this;

    me.element.on('wheel', function(e){
        e.preventDefault();
        e.stopPropagation();

        var index = me.digitContainer.find('.digit').index(e.target);
        if (index < 0) return;

        var delta = 10 ** (Math.floor(Math.max(6, Math.log10(me.frequency))) - index);
        if (e.originalEvent.deltaY > 0) delta *= -1;
        var newFrequency = me.frequency + delta;

        me.element.trigger('frequencychange', newFrequency);
    });

    var submit = function () {
        var unit = '1e' + $('#option-freq-unit').val();
        var freq = Math.round(parseFloat(me.input.val()) * unit);
        if (!isNaN(freq)) {
            me.element.trigger('frequencychange', freq);
        }
        me.input.hide();
        me.displayContainer.show();
    };
    me.input.on('blur', submit).on('keyup', function(e){
        if (e.keyCode == 13) return submit();
        if (e.keyCode == 27) {
            me.input.hide();
            me.displayContainer.show();
        }
    });
    me.input.on('click', function(e){
        e.stopPropagation();
    });
    me.element.on('click', function(){
        var unit = '1e' + $('#option-freq-unit').val();
        me.input.val(me.frequency / unit);
        me.input.show();
        me.displayContainer.hide();
        me.input.focus();
    });
};

$.fn.frequencyDisplay = function() {
    if (!this.data('frequencyDisplay')) {
        this.data('frequencyDisplay', new FrequencyDisplay(this));
    }
    return this.data('frequencyDisplay');
}

$.fn.tuneableFrequencyDisplay = function() {
    if (!this.data('frequencyDisplay')) {
        this.data('frequencyDisplay', new TuneableFrequencyDisplay(this));
    }
    return this.data('frequencyDisplay');
}
