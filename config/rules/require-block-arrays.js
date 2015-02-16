var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(requireBlockArrays) {
        assert(
            typeof requireBlockArrays === 'boolean',
            'requireBlockArrays option requires boolean value'
        );
        assert(
            requireBlockArrays === true,
            'requireBlockArrays option requires true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'requireBlockArrays';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ArrayExpression', function(node) {
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
                elements = node.elements,
                prevObjectPos = -2;

            if (elements.length === 0) {
                if ((nodeStartLine !== nodeEndLine) || (nodeEndCol !== (nodeStartCol + 2))) {
                    errors.add('Empty arrays have to be defined in one line', openingBracket.loc.end);
                }
            } else {
                if (node.parentNode.type === 'CallExpression') {
                    for (var i in elements) {
                        var element = elements[i];
                        if (element.type !== 'Identifier' && element.type !== 'Literal') {
                            errors.add('You should only use identifiers or literals for array declaration inside a function call', element.loc.start);
                        }
                    }
                } else {

                    if ((openingBracket.loc.start.line === nextToken.loc.start.line) && nextToken.value !== '{') {
                        errors.add('Arrays must be defined in block style', openingBracket.loc.end);
                    }

                    if ((closingBracket.loc.start.line === prevToken.loc.start.line) && prevToken.value !== '}') {
                        errors.add('Arrays must be defined in block style', prevToken.loc.end);
                    }

                    for (var i in elements) {
                        var element = elements[i],
                            elementStartLine = element.loc.start.line,
                            elementStartCol = element.loc.start.column,
                            elementEndLine = element.loc.end.line,
                            elementEndCol = element.loc.end.column,
                            prevObject,
                            prevObjectEndLine,
                            prevObjectEndCol;

                        // Only check arrays which consist of objects exclusively
                        if (element.type !== 'ObjectExpression') {
                            break;
                        }

                        // test beginning inside array
                        if (parseInt(i) === 0) {
                            if((elementStartLine !== nodeStartLine) || (elementStartCol !== nodeStartCol + 1)) {
                                errors.add('The opening bracket of the first object inside array should follow the array one', element.loc.start);
                            }
                        }

                        // test end inside array
                        if (parseInt(i) === (elements.length - 1)) {
                            if((elementEndLine !== nodeEndLine) || (nodeEndCol !== elementEndCol + 1)) {
                                errors.add('The closing bracket of the last object inside array should precede the array one', element.loc.end);
                            }
                        }

                        // predecessor was object, check style
                        if (prevObjectPos + 1 === parseInt(i)) {
                            prevObject = elements[prevObjectPos];
                            prevObjectEndLine = prevObject.loc.end.line;
                            prevObjectEndCol  = prevObject.loc.end.column;

                            if (prevObjectEndLine !== elementStartLine) {
                                errors.add('Opening bracket should be in the same line as closing if two objects follow inside an array', element.loc.start);
                            }

                            if ((prevObjectEndCol + 2) !== elementStartCol) {
                                errors.add('Opening bracket should be separated by a whitespace', element.loc.start);
                            }
                        }

                        prevObjectPos = parseInt(i);
                    }
                }
            }
        });
    }
};
