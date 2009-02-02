rm -rf `find ./ -name ".DS_Store"`
rm -rf `find ./ -name "Thumbs.db"`
rm slashdotter.xpi
rm -rf .tmp_xpi_dir/

chmod -R 0777 slashdotter/

mkdir .tmp_xpi_dir/
cp -r slashdotter/* .tmp_xpi_dir/
rm -rf `find ./.tmp_xpi_dir/ -name ".svn"`

cd .tmp_xpi_dir/chrome/
zip -rq ../slashdotter.jar *
rm -rf *
mv ../slashdotter.jar ./
cd ../
zip -rq ../slashdotter.xpi *
cd ../



mkdir ~/Library/Application\ Support/Fennec/Profiles/uh6wew3f.default/extensions/\{c4f1fdfb-49f5-4cb5-a4e5-3b857ca2ef95\}/
rm -rf               ~/Library/Application\ Support/Fennec/Profiles/uh6wew3f.default/extensions/\{c4f1fdfb-49f5-4cb5-a4e5-3b857ca2ef95\}/*
cp -r .tmp_xpi_dir/* ~/Library/Application\ Support/Fennec/Profiles/uh6wew3f.default/extensions/\{c4f1fdfb-49f5-4cb5-a4e5-3b857ca2ef95\}/






rm -rf .tmp_xpi_dir/

cp slashdotter.xpi ~/Desktop/
