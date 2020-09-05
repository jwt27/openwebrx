function SettingsPanel(el) {
    var self = this;
    self.el = el;

    el.on('change', '#option-freq-unit', function () {
        var value = $(this).val();
        localStorage.setItem('freq-unit', value);
        self.updateDecimals(value);
    });
    el.on('change', '#option-freq-decimals', function() {
        var value = $(this).val();
        localStorage.setItem('freq-decimals', value);
        self.updateFrequencyDisplay();
    });

    var freq_unit = localStorage.getItem('freq-unit');
    if (freq_unit === null) {
        freq_unit = 3;
    }
    $('#option-freq-unit').val(freq_unit);
    $('#option-freq-unit').change();

    var freq_decimals = localStorage.getItem('freq-decimals');
    if (freq_decimals === null || freq_decimals > freq_unit) {
        freq_decimals = freq_unit;
    }
    $('#option-freq-decimals').val(freq_decimals);
    $('#option-freq-decimals').change();
};

SettingsPanel.prototype.updateFrequencyDisplay = function() {
    $('#openwebrx-panel-receiver').demodulatorPanel().tuneableFrequencyDisplay.update();
}

SettingsPanel.prototype.updateDecimals = function (max) {
    var select = $('#option-freq-decimals');
    var value = select.val();

    select.empty();
    for (var i = 0; i <= max; ++i) {
        select.append($('<option>').text(i));
    }

    select.val(Math.min(value, max));
    this.updateFrequencyDisplay();
}

$.fn.settingsPanel = function(){
    if (!this.data('panel')) {
        this.data('panel', new SettingsPanel(this));
    };
    return this.data('panel');
};
