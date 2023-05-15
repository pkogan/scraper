<?php

function Dom2Array($root) {
    $array = array();

    //list attributes
    if ($root->hasAttributes()) {
        foreach ($root->attributes as $attribute) {
            $array['_attributes'][$attribute->name] = $attribute->value;
        }
    }

    //handle classic node
    if ($root->nodeType == XML_ELEMENT_NODE) {
        $array['_type'] = $root->nodeName;
        if ($root->hasChildNodes()) {
            $children = $root->childNodes;
            for ($i = 0; $i < $children->length; $i++) {
                $child = Dom2Array($children->item($i));

                //don't keep textnode with only spaces and newline
                if (!empty($child)) {
                    $array['_children'][] = $child;
                }
            }
        }

        //handle text node
    } elseif ($root->nodeType == XML_TEXT_NODE || $root->nodeType == XML_CDATA_SECTION_NODE) {
        $value = $root->nodeValue;
        if (!empty($value)) {
            $array['_type'] = '_text';
            $array['_content'] = $value;
        }
    }

    return $array;
}

$arrFiles = glob('lapampa*');
print_r($arrFiles);


foreach ($arrFiles as $key => $archivo) {
    echo $archivo;
    $str = file_get_contents($archivo);
    echo $str;
    $root = new DOMDocument();
    $root->load($archivo);
    //$contents = $root->getElementById('content')->nodeValue;
    var_dump($root);
   $array = Dom2Array($root);
    //var_dump($array);
    exit();
}