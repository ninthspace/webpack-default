<?php

public function manifest($filenameWithExtension)
{
    $pathToPublic             = "/resources/public/";
    $info                     = pathinfo($filenameWithExtension);
    $extension                = $info['extension'];
    $filenameWithoutExtension = basename($filenameWithExtension, '.'.$extension);

    $manifest = file_get_contents(".{$pathToPublic}manifest.json");
    if ($manifest) {
        $manifestStructure          = json_decode($manifest);
        $candidateManifestFilenames = $manifestStructure->{$filenameWithoutExtension};
        foreach ($candidateManifestFilenames as $candidateManifestFilename) {
            $info                                      = pathinfo($candidateManifestFilename);
            $manifestExtension                         = $info['extension'];
            $candidateManifestFilenameWithoutExtension = basename($candidateManifestFilename, '.'.$manifestExtension);

            if ((strpos($candidateManifestFilenameWithoutExtension, $filenameWithoutExtension) === 0) &&
                ($extension === $manifestExtension)
            ) {
                $manifestFilenameWithExtension = $candidateManifestFilename;
                break;
            }
        }
    } else {
        $manifestFilenameWithExtension = $filenameWithExtension;
    }

    return $pathToPublic.$manifestFilenameWithExtension;
}

// then use manifest('something.js') where a view is built, which will return the full path
// e.g. '/resources/publicc/something.34a64266a59b7b662b97.js'