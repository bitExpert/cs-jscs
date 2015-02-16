var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(require) {
        assert(
            typeof require === 'boolean',
            this.getOptionName() + ' option requires boolean value'
        );
        assert(
            require === true,
            this.getOptionName() + ' option requires true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'requireSpaceBeforeObjectPropertyValue';
    },

    check: function(file, errors) {
        var tokens = file.getTokens();
        file.iterateNodesByType('ObjectExpression', function(node) {
            node.properties.forEach(function(property) {
                var key = property.key,
                    value = property.value,
                    keyPos = file.getTokenPosByRangeStart(key.range[0]),
                    colon = tokens[keyPos + 1],
                    spaces;

                spaces = value.range[0] - colon.range[1];

                if (spaces > 1) {
                    errors.add('Too many spaces before object property value assignment', colon.loc.end);
                }

                if (spaces < 1) {
                    errors.add('Missing space before object property value assignment', colon.loc.end);
                }
            });
        });
    }

};
