var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(requireBlockObjects) {
        assert(
            typeof requireBlockObjects === 'boolean',
            'requireBlockObjects option requires boolean value'
        );
        assert(
            requireBlockObjects === true,
            'requireBlockObjects option requires true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'requireBlockObjects';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ObjectExpression', function(node) {
            var tokens = file.getTokens(),
                closingBracketPos = file.getTokenPosByRangeStart(node.range[1] - 1),
                openingBracketPos = file.getTokenPosByRangeStart(node.range[0]),
                openingBracket = tokens[openingBracketPos],
                closingBracket = tokens[closingBracketPos],
                nextToken = tokens[openingBracketPos + 1],
                prevToken = tokens[closingBracketPos - 1],
                nodeStartLine  = node.loc.start.line,
                nodeStartCol = node.loc.start.column,
                nodeEndLine = node.loc.end.line,
                nodeEndCol = node.loc.end.column,
                properties = node.properties,
                propertyLine = null;
            
            if (properties.length === 0) {
                if ((nodeStartLine !== nodeEndLine) || (nodeEndCol !== (nodeStartCol + 2))) {
                    errors.add('Empty objects have to be defined in one line', openingBracket.loc.end);
                }
            } else {
                if (openingBracket.loc.start.line === nextToken.loc.start.line) {
                    errors.add('Objects must be defined in block style', openingBracket.loc.end);
                }

                if (closingBracket.loc.start.line === prevToken.loc.start.line) {
                    errors.add('Objects must be defined in block style', prevToken.loc.end);
                }
                
                for(var i in node.properties) {
                    var prop = node.properties[i];
                    if (prop.loc.start.line === propertyLine) {
                        errors.add('Objects must be defined in block style', prop.loc.start);
                    }
                    
                    propertyLine = prop.loc.start.line;
                }
            }
        });        
    }

};
