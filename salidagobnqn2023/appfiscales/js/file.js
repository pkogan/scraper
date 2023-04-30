"use strict";

/* Choripaned from:
 * http://docs.phonegap.com/en/edge/cordova_file_file.md.html#FileWriter
 */

function fs_write(filename, data, callback){
    /* Write a file to `filename` with `data`
     * and call `callback` with the file URL.
     */

    function gotFS(fileSystem) {
        fileSystem.root.getFile(filename, {create: true, exclusive: false}, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter.bind(this, fileEntry), fail);
    }

    function gotFileWriter(fileEntry, writer) {
        writer.write(data);
        writer.onwriteend = function(){
            callback(fileEntry.toURL());
        };
    }

    function fail(error) {
        console.log(error.code);
    }

    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, fail);
}
