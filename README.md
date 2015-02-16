# bitexpert-cs-jscs


This repository contains the configuration for jscs which is used by the grunt-jscs-checker plugin to check JavaScript 
Code Style.

## Installation

It is required to have the scss-lint ruby package installed as the grunt-scss-lint plugin is a wrapper round that tool. 
You can use gem to install the package:

    sudo gem install scss-lint

Add the "bitexpert-cs-jscs" package to the dev-dependencies section of your package.json file which resides in the 
root folder of your project:

    "devDependencies": {
        "bitexpert-cs-jscs": "^0.1.0"
    }

Now run npm install to download and install bitexpert-cs-jscs as well as the required dependencies:

    npm install

## License

bitexpert-cs-jscs is released under the Apache 2.0 license.
