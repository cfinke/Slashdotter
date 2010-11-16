rm ~/Desktop/slashdotter.xpi

rm -rf `find ./ -name ".DS_Store"`
rm -rf `find ./ -name "Thumbs.db"`
rm -rf .tmp_xpi_dir/

chmod -R 0777 slashdotter/

mkdir .tmp_xpi_dir/
cp -r slashdotter/* .tmp_xpi_dir/
rm -rf `find ./.tmp_xpi_dir/ -name ".git"`

cd .tmp_xpi_dir/
zip -rq ~/Desktop/slashdotter.xpi *
cd ..
rm -rf .tmp_xpi_dir/