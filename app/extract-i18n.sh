#!/bin/bash

# Exit on any error
set -e

echo "Extracting i18n messages..."

# Extract messages to source file
ng extract-i18n --output-path=src/locale

echo "Messages extracted to src/locale/messages.xlf"

# If Japanese translation file doesn't exist, create a copy
if [ ! -f "src/locale/messages.ja.xlf" ]; then
  echo "Creating new Japanese translation file..."
  cp src/locale/messages.xlf src/locale/messages.ja.xlf
  echo "Created src/locale/messages.ja.xlf"
else
  echo "Japanese translation file already exists."
  echo "Manual merge of translations will be required."
  echo "You can use an XLIFF editor or manually merge the translations."
fi

echo "i18n extraction complete."
echo "Please edit src/locale/messages.ja.xlf to provide translations."
echo "After translations are complete, run 'ng build --localize' to build the localized app." 