nvm use 16
echo "npm run start -- --locale vi"
eche "mkdir -p i18n/en/docusaurus-plugin-content-docs/current; cp -r docs/** i18n/en/docusaurus-plugin-content-docs/current; mkdir -p i18n/en/docusaurus-plugin-content-blog; cp -r blog/** i18n/en/docusaurus-plugin-content-blog; npm run write-translations -- --locale en"