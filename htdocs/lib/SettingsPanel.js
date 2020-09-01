function SettingsPanel(el) {
    var self = this;
    self.el = el;

    el.on('change', '#option-freq-unit', function () {
        var value = $(this).val();
        self.updateDecimals(value);
    });
    el.on('change', '#option-freq-decimals', function () {
        $('#openwebrx-panel-receiver').demodulatorPanel().tuneableFrequencyDisplay.update();
    });

    $('#option-freq-unit').val(3);
    $('#option-freq-unit').change();
    $('#option-freq-decimals').val(3);
    $('#option-freq-decimals').change();
};

SettingsPanel.prototype.updateDecimals = function (max) {
    var select = $('#option-freq-decimals');
    var value = select.val();

    select.empty();
    for (var i = 0; i <= max; ++i) {
        select.append($('<option>').text(i));
    }

    select.val(Math.min(value, max));
    select.change();
}

$.fn.settingsPanel = function(){
    if (!this.data('panel')) {
        this.data('panel', new SettingsPanel(this));
    };
    return this.data('panel');
};
